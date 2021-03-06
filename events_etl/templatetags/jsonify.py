from django import template
from django.utils.safestring import mark_safe

import json

register = template.Library()

@register.filter(name='json')
def jsonify(data):
    return mark_safe(json.dumps(data))
