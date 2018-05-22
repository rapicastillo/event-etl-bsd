# encoding=utf8

from etl.lib.crm import bluestatedigital as bsd
from etl.lib.base import export
import os
import requests
import json

def run():
    print('RUN] Running Scheduled work')
    name=os.environ.get('REMOTE_FILENAME')
    source_url = os.environ.get('BSD_ENDPOINT')
    scraper = bsd.EventsScraper(source_url, os.environ.get('SUPERGROUP_NAME'))
    scraper.run()
    events_data = scraper.get_data()

    # For headquarters
    json_data = []
    global_url = 'http://gsx2json.com/api?id=1NAsqY1qkwUFFZk4zJHSCA4k2ROW9h2MsakZj7uwA9aA&sheet=1&integers=false'
    req = requests.get(global_url)
    if req.status_code != 200:
        raise ValueError("Error in retrieving ", req.status_code)
    else:
        json_data = json.loads(req.text)


    hq_data = [{'title': row['title'],
            'event_type': row['eventtype'],
            'supergroup': 'Beto for Texas',
            'lat': row['lat'],
            'lng': row['lng'],
            'url': row['url'],
            'email': row['email'],
            'phone': row['phone'],
            'office_hours': row['officehours'],
            'venue': row['venue']} for row in json_data['rows'] if row['isshown'].upper() == 'YES']

    exported_data = events_data + hq_data
    print(json.dumps(exported_data))
    export.Exporter.s3_export(exported_data, name)
