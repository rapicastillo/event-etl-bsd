# encoding=utf8

from etl.lib.crm import bluestatedigital as bsd
from etl.lib.base import export
from dateutil.parser import parse

import os
import requests
import json
import django

django.setup()

from django.db.models import Q
from events_etl.models import Event

def run():
    print('RUN] Running Scheduled work')
    name=os.environ.get('REMOTE_FILENAME')
    source_url = "https://secure.staceyabrams.com/page/event/search_results"
    scraper = bsd.EventsScraper(source_url, "Stacey Abrams for Governor")
    scraper.run()
    events_data = scraper.get_data()

    exported_data = events_data #+ hq_data
    print(json.dumps(exported_data))

    # Set visible to false
    Event.objects.filter(~Q(visible=False)).update(visible=False)

    # Create items
    for item in exported_data:

        event, created = Event.objects.get_or_create(bsd_id=item['id'])

        if created:
            event.title=item['title']
            event.url=item['url']
            event.venue=item['venue']
            event.event_type=item['event_type']
            event.address=item['address']
            event.city=item['city']
            event.state=item['state']
            event.zipcode=item['zipcode']
            event.latitude=item['lat']
            event.longitude=item['lng']
            event.start_datetime = parse(item['start_time'])
            event.start_day = parse(item['event_date'])
            event.start_time = parse(item['event_time'])
            event.visible = True
            event.save()
        else:
            event.visible = True
            event.save()
    # export.Exporter.s3_export(exported_data, name)
