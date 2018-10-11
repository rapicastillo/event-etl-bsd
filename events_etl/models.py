from django.db import models

class Event(models.Model):
    bsd_id=models.IntegerField(null=True)
    title=models.CharField(max_length=500,blank=True,null=True)
    event_type=models.CharField(max_length=500,blank=True,null=True)
    url=models.CharField(max_length=500,blank=True,null=True)
    venue=models.CharField(max_length=500,blank=True,null=True)
    address=models.CharField(max_length=500,blank=True,null=True)
    city=models.CharField(max_length=500,blank=True,null=True)
    state=models.CharField(max_length=500,blank=True,null=True)
    zipcode=models.CharField(max_length=100,blank=True,null=True)
    latitude=models.FloatField(null=True)
    longitude=models.FloatField(null=True)
    start_day=models.DateField(null=True)
    start_time=models.TimeField(null=True)
    start_datetime=models.DateTimeField(null=True)
    timezone=models.CharField(max_length=50,blank=True,null=True)
    visible=models.BooleanField(default=False)
