from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.pagination import PageNumberPagination
from datetime import timedelta

#helpers
def get_sentinel_user():
    """
    get default user for foreignkey relationship
    """
    return get_user_model().objects.get_or_create(username='deleted')[0]

def get_default_expiry():
    """
    default contract expiry is 1 day
    """
    return (timezone.now() + timedelta(days=1)).date()


def book_year_validator(value):
    """
    book year cannot be more than current year
    """
    return not value or 0 < value <= timezone.now().year


class noPagination(PageNumberPagination):
    page_size = 50
    max_page_size = 50


def valid_report(user):
    """
    non staff users can only send 1 message every 5 minutes
    """
    if user.is_staff:
        return True

    latest = user.reports.first()
    return not latest or timezone.now() - latest.timestamp > timedelta(minutes=5)




