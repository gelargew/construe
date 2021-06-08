from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils import timezone
from django.utils.text import slugify
from datetime import timedelta

from .utils import get_default_expiry, get_sentinel_user, book_year_validator


CONTRACT_STATUSES = (
    ('waiting', 'waiting'),
    ('active', 'active'),
    ('returned', 'returned'),
    ('late', 'late'),
    ('expired', 'expired'),
    ('cancelled', 'cancelled'),
)


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
    year = models.PositiveSmallIntegerField(validators=[book_year_validator], blank=True, null=True)
    quantity = models.PositiveSmallIntegerField(default=1)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    slug = models.SlugField()
    like = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='likes', blank=True)
    dislike = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='dislikes', blank=True)

    class Meta:
        ordering = ('title',)
    
    def __str__(self) -> str:
        return self.title[:20]


class Contract(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, related_name='contracts')
    book = models.ForeignKey('books.Book', on_delete=models.RESTRICT)
    expiry = models.DateField(default=get_default_expiry, blank=True)
    status = models.CharField(choices=CONTRACT_STATUSES, default='waiting', max_length=36)
    duration = models.PositiveSmallIntegerField(null=True, blank=True, default=7)

    class Meta:
        ordering = ('expiry', '-status')
        constraints = [models.UniqueConstraint(fields=['book', 'user'], name='unique_book_user', condition=models.Q(status='waiting'))]

    def __str__(self) -> str:
        return f'{self.user} ----- book: {self.book.title} ----- status: {self.status} {self.expiry}'

    def save(self, *args, **kwargs):
        if self.status == 'active':
            self.expiry = timezone.now().date() + timedelta(days=self.duration)
        super().save(*args, **kwargs)



class Comment(models.Model):
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
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
    contracts = models.ManyToManyField('books.Contract', blank=True)
    timestamp = models.DateField(blank=True, default=timezone.now)

    class Meta:
        verbose_name = 'automatic update'

    def __str__(self) -> str:
        return f'{self.timestamp}'


class ContactUs(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports')
    message = models.CharField(max_length=512)
    title = models.CharField(max_length=128, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    reply = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

    class Meta:
        verbose_name = 'user report'
        ordering = ('-pk',)

    def __str__(self) -> str:
        return f'{self.title} - {self.message[:50]} - from:{self.user.username}'
