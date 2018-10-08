from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from .models import Event
from dateutil.parser import parse
import datetime
import json

# Create your views here.
def index(request):
    # return HttpResponse('Hello from Python!')
    events = Event.objects.filter(start_datetime__gte=datetime.datetime.now())
    event_list = [{ 'supergroup': "Stacey Abrams",
                    'event_type': item.event_type,
                    'title': item.title,
                    'url': item.url,
                    'venue':  ' '.join(filter(None, [
                              item.venue,
                              item.address,
                              item.city,
                              item.state,
                              item.zipcode
                            ])),
                    'lat': item.latitude,
                    'lng': item.longitude,
                    'start_time': item.start_datetime.strftime("%Y-%m-%dT%H:%M:%sZ"),
                 } for item in events]
    return render_to_response('index.html', {'events': event_list})
