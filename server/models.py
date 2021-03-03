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


class Book(models.Model):
    title = models.CharField(max_length=100)
    category = models.ManyToManyField(Category, related_name='books', blank=True)
    added = models.DateTimeField(auto_now_add=True)
    year = models.DateTimeField(null = True, blank=True)
    available = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f'{self.title} - available: {self.available}'

    def returned(self):
        self.available += 1
        super().save()

    def rented(self):
        self.available -= 1
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
        
