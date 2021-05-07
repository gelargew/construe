from django.contrib.auth import get_user_model
from django.utils import timezone
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
    return 0 < value <= timezone.now().year