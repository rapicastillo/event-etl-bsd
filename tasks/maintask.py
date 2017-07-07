# encoding=utf8

from etl.lib.crm import bluestatedigital as bsd
from etl.lib.base import export
import os


def run():
    print('RUN] Running Scheduled work')
    #"https://secure.billdeblasio.com/page/event/search_results"
    #"Bill de Blasio for NYC"
    name=os.environ.get('REMOTE_FILENAME')
    source_url = os.environ.get('BSD_ENDPOINT')
    scraper = bsd.EventsScraper(source_url, os.environ.get('SUPERGROUP_NAME'))
    scraper.run()
    export.Exporter.s3_export(scraper.get_data(), name)
