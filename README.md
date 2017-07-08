# Events ETL: BSD

Start of ETL for all events for progressive applications.

# Setting Up ETL

The following are steps to setup the ETL for BSD.

### 1. Clone this and create a heroku instance from this.

```
$ heroku create <name>
$ git push heroku master
```

### 2. Setting up the environment variables

| key | description |
|--- |--- |
| `AWS_ACCESS_KEY_ID` | Access Key for S3 bucket |
| `AWS_SECRET_ACCESS_KEY` | Secret AccessKey for Indivisible bucket |
| `AWS_HOST` | AWS Host for S3 |
| `S3_BUCKET` | Name of the bucket we're going to put the data in |
| `CLOUDFRONT_ID` | Cloudfront instance dedicated to the S3 instance |
| `BSD_ENDPOINT` | URL for the BSD search endpoint. Usually ends with `/page/event/search_results` |
| `REMOTE_FILENAME` | Name of the file to be taken. |
| `SUPERGROUP_NAME` | This is the name of the campaign. It's included in the json as `supergroup` |
| `DISABLE_COLLECTSTATIC` | Set this to **1** . This is for when we activate redis |

### 3. Setup Python RQ

[`Source`](https://devcenter.heroku.com/articles/python-rq)

Most of the work are already done in the etl. The only thing you need now is to setup redis. Run these in your setup

```
heroku addons:create redistogo
heroku scale worker=1
heroku scale clock=1
```

### 4. Monitor Logs

You should be all set! You can monitor logs via:

```
heroku logs --tail
```

# File outputs

If the AWS and cloudfront endpoints are properly setup, the following files will be available:

* //`cloudfront_id`.cloudfront.net/output/`remote_filename`.js.gz
* //`cloudfront_id`.cloudfront.net/raw/`remote_filename`.json

You should be able to use these for your `event-map` application or any event interface.
