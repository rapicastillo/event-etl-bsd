from django.db import models

# Create your models here.
class EventSource(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    
class Campaign(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    url = models.CharField(max_length=200)
    access_key = models.CharField(max_length=100)
    secret_key = models.CharField(max_length=100)
    source_type = models.ForeignKey(EventSource, on_delete=models.CASCADE)

    
    
