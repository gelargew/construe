from django.urls import path
from django.urls.conf import re_path
from django.views.generic.base import RedirectView

from .views import index

urlpatterns = [
    path('', index),

    re_path(r'^(?!admin)^(?!auth)^(?!media)^(?!api).*', index)
]
