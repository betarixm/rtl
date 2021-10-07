"""
WSGI config for rtl project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

from whitenoise import WhiteNoise
from django.core.wsgi import get_wsgi_application

from .settings import STATIC_ROOT

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rtl.settings')

application = get_wsgi_application()
application = WhiteNoise(application, root=STATIC_ROOT)