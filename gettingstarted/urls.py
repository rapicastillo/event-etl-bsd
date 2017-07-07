from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

import events_etl.views

# Examples:
# url(r'^$', 'gettingstarted.views.home', name='home'),
# url(r'^blog/', include('blog.urls')),

urlpatterns = [
    url(r'^$', events_etl.views.index, name='index'),
    url(r'^db', events_etl.views.db, name='db'),
    url(r'^admin/', include(admin.site.urls)),
]
