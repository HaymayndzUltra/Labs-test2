"""
Celery configuration for accept-nextjs-django project.
"""

import os

from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'accept-nextjs-django.settings.production')

app = Celery('accept-nextjs-django')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    """Debug task to test Celery configuration"""
    print(f'Request: {self.request!r}')