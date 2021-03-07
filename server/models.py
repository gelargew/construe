from django.db import models
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

CONTRACT_STATUS = (
    ('active', 'active'),
    ('returned', 'returned'),
    ('late', 'late')
)

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self) -> str:
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=100)
    categories = models.ManyToManyField(Category, related_name='categories', blank=True)

    def __str__(self) -> str:
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, related_name='author', on_delete=models.PROTECT, blank=True, null=True, default=None)
    category = models.ManyToManyField(Category, related_name='books', blank=True)
    description = models.TextField(blank=True, default='no description')
    added = models.DateTimeField(auto_now_add=True)
    year = models.DateTimeField(null = True, blank=True)
    quantity = models.IntegerField(default=0)
    image = models.ImageField(upload_to='images/', blank=True, null=True)

    def __str__(self) -> str:
        return f'{self.title} - quantity: {self.quantity}'



    def returned(self):
        self.quantity += 1
        super().save()

    def rented(self):
        self.quantity -= 1
        super().save()

    

class Contract(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    book = models.ForeignKey(Book, on_delete=models.PROTECT)
    expiry = models.DateTimeField(default=timezone.now() + timedelta(7), blank=True)
    status = models.CharField(choices=CONTRACT_STATUS, default='active', max_length=36)

    def __str__(self) -> str:
        return f'{self.user} book: {self.book.title}'

    def save(self, *args, **kwargs):
        if 'duration' in kwargs:
            duration = int(kwargs['duration'])       
            self.expiry = timezone.now() + timedelta(duration)
        super().save(*args, **kwargs)
        self.book.rented()
    
    def delete(self, *args, **kwargs):
        if self.status == 'returned':
            super().delete()

    def returnBook(self, *args, **kwargs):
        self.book.returned()
        
