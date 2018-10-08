from django.conf.urls import include, url
from django.urls import path

from django.contrib import admin
admin.autodiscover()


import events_etl.views

# Examples:
# url(r'^$', 'gettingstarted.views.home', name='home'),
# url(r'^blog/', include('blog.urls')),

urlpatterns = [
    url(r'^$', events_etl.views.index, name='index'),
    url(r'^admin/', admin.site.urls),
]
