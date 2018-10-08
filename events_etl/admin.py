from django.contrib import admin

# Register your models here.
from .models import Event

class EventAdmin(admin.ModelAdmin):
    pass

# Register your models here.
admin.site.register(Event, EventAdmin)
