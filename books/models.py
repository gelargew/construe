from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
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
    return 0 < value < timezone.now().year()


class Category(models.Model):
    name = models.CharField(max_length=128)

    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')

    def __str__(self) -> str:
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=128)
    author = models.CharField(max_length=100, null=True, blank=True)
    category = models.ManyToManyField(Category, related_name='books', blank=True)
    description = models.TextField(blank=True, null=True)
    added = models.DateField(auto_now_add=True)
    year = models.PositiveSmallIntegerField(validators=[book_year_validator])
    quantity = models.IntegerField(default=1)
    image = models.ImageField(upload_to='images/', blank=True, null=True)

    class Meta:
        ordering = ('title',)
    
    def __str__(self) -> str:
        return self.title[:20]

    def add(self):
        self.quantity += 1
        super().save()

    def substract(self):
        self.quantity -= 1
        super().save()


CONTRACT_STATUSES = (
    ('waiting', 'waiting'),
    ('active', 'active'),
    ('returned', 'returned'),
    ('late', 'late'),
    ('expired', 'expired'),
    ('cancelled', 'cancelled'),
)

class Contract(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT)
    book = models.ForeignKey(Book, on_delete=models.RESTRICT)
    expiry = models.DateField(default=get_default_expiry, blank=True)
    status = models.CharField(choices=CONTRACT_STATUSES, default='waiting', max_length=36)

    class Meta:
        ordering = ('expiry', 'status')

    def __str__(self) -> str:
        return f'{self.user} ----- book: {self.book.title} ----- status: {self.status} {self.expiry}'


class Rating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveSmallIntegerField(null=True, default=0, blank=True)

    def __str__(self) -> str:
        return f'{self.book} rate: {self.rating} by: {self.user.username}'



class Comment(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET(get_sentinel_user))
    body = models.CharField(max_length=300)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    reply = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    class Meta:
        ordering = ('-timestamp',)

    def __str__(self) -> str:
        return f'{self.user} ---- {self.body[:20]} ----- {self.timestamp}'


class ContractUpdater(models.Model):
    """
    this model will update active and waiting contracts that has been expired, 
    the updated contracts will be written in this model as an update history
    """
    contracts = models.ManyToManyField(Contract, blank=True)
    timestamp = models.DateField(blank=True, default=timezone.now)

    class Meta:
        verbose_name = 'automatic update'

    def __str__(self) -> str:
        return f'{self.timestamp}'

    #asd