# encoding=utf8

from boto.s3.connection import S3Connection
from boto.s3.key import Key

import boto
import os
import json
import gzip

class Exporter(object):

    @staticmethod
    def s3_export(data, name):
        raw_data = json.dumps(data)
        script_content = 'window.EVENTS_DATA=' + raw_data

        with gzip.open(name + '.js.gz', 'wb') as f:
            f.write(str(script_content).encode('utf-8'))

        with open(name + '.json', 'w') as f:
            f.write(raw_data)

        aws_host = os.environ.get('AWS_HOST')
        aws_bucket = os.environ.get('S3_BUCKET')
        cloudfront_id = os.environ.get('CLOUDFRONT_ID')

        conn = S3Connection(host=aws_host)

        bucket = conn.get_bucket(aws_bucket)

        key = bucket.get_key('output/' + name + '.js.gz')
        key_raw = bucket.get_key('raw/' + name + '.json')

        if key is None:
            print("Creating New Bucket")
            key = bucket.new_key('output/'+name+'.js.gz')

        if key_raw is None:
            print("Creating New Raw File")
            key_raw = bucket.new_key('raw/'+name+'.json')

        # Upload data to S3
        print("Uploading RAW to S3")
        key_raw.set_contents_from_filename(name+'.json')
        key_raw.set_acl('public-read')

        print("Uploading GZIP to S3")
        key.set_metadata('Content-Type', 'text/plain')
        key.set_metadata('Content-Encoding', 'gzip')
        key.set_contents_from_filename(name + '.js.gz')
        key.set_acl('public-read')

        # Cloudfront Invalidation requests
        print("Invalidating Output")
        cloudfront = boto.connect_cloudfront()
        paths = ['/output/*']
        inval_req = cloudfront.create_invalidation_request(cloudfront_id, paths)

        #Delete all files
        os.remove(name + ".js.gz")
        os.remove(name + ".json")
