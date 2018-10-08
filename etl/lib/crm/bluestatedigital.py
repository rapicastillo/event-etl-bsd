# encoding=utf8

import os
import requests
import json
import datetime
import etl.lib.base.scraper as scraper
from pytz import timezone

class EventsScraper(scraper.Scraper):

    def __init__(self, url, supergroup = None, subgroup = None):
        self.url = url
        self.clean_data = None
        self.raw_data = None

        self.supergroup = supergroup
        self.subgroup = subgroup

    def run(self):
        """
        This orchestrates the various methods
        """
        self.raw_data = self.retrieve()
        self.clean_data = self.clean(self.raw_data)
        self.minified_data = self.translate(self.clean_data)
        self.osdified_data = self.osdify(self.minified_data)

    def retrieve(self):
        """
        This is where the items will be processed
        by getting the data out
        """
        # No Pagination
        req = requests.get(self.url, params={'country': 'US','state':'GA','limit': 5000,'format': 'json'})

        if req.status_code != 200:
            raise ValueError("Error in retrieving ", req.status_code)
        else:
            return json.loads(req.text)['results']


    def clean(self, raw):
        """
        This will clean the information out that is
        considered private information
        """
        # Nothing to clean
        return raw

    def translate(self, data):
        """
        This prepares the data for a singular
        cleaned format
        """
        translated = []
        for item in data:

            venue = ' '.join( filter(None, [ \
                      item['venue_name'],\
                      item['venue_addr1'],\
                      item['venue_city'],\
                      item['venue_state_cd'],\
                      item['venue_zip'] \
                    ]))

            translated.append({
                'supergroup': self.supergroup,
                'group': self.subgroup,
                'id': item['id'],
                'event_type': item['event_type_name'],
                'title': item['name'],
                'url': item['url'],
                'venue': item['venue_name'],
                'address': item['venue_addr1'],
                'city': item['venue_city'],
                'state': item['venue_state_cd'],
                'zipcode': item['venue_zip'],
                'lat': item['latitude'],
                'lng': item['longitude'],
                'start_time': item['start_dt'],
                'event_date': item['start_day'],
                'event_time': item['start_time'],
                'tz': item['timezone']
            })
        #endof for item in data:

        return translated


    def osdify(self, data):
        """
        Translate the data to OSDI format
        """
