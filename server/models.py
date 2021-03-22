from django.db import models
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist


CONTRACT_STATUS = (
    ('waiting', 'waiting'),
    ('active', 'active'),
    ('returned', 'returned'),
    ('late', 'late'),
    ('book unavailable', 'book unavailable'),
    ('cancelled', 'cancelled'),
    ('expired', 'expired'),
)

CONTRACT_TYPE = (
    ('rent', 'rent'),
    ('donate', 'donate'),
    ('request', 'request')
)

BOOK_STATUS = (
    ('active', 'active'),
    ('request', 'request'),
    ('donate-request', 'donate-request')
)


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
    year = models.CharField(null = True, blank=True, max_length=50)
    quantity = models.IntegerField(default=1)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    status = models.CharField(choices=BOOK_STATUS, null=True, blank=True, max_length=36)

    def __str__(self) -> str:
        return f'{self.title} - {"" if self.quantity > 0 else "*out of order"}'

    def returned(self):
        self.quantity += 1
        super().save()

    def rented(self):
        self.quantity -= 1
        super().save()

    

class Contract(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    book = models.ForeignKey(Book, on_delete=models.PROTECT)
    expiry = models.DateTimeField(default=timezone.now() + timedelta(days=1), blank=True)
    status = models.CharField(choices=CONTRACT_STATUS, default='waiting', max_length=36)
    duration = models.IntegerField(default=1, blank=True)
    contract_type = models.CharField(choices=CONTRACT_TYPE, blank=True, default='rent', max_length=36)

    class Meta:
        ordering = ['expiry', '-status']

    def __str__(self) -> str:
        return f'{self.user} book: {self.book.title} status: {self.status}'  

    def save(self):
        if self.book.quantity < 1:
            return
        super().save()
    
    def delete(self):
        if self.status == 'returned' or self.status == 'waiting':
            super().delete()

    def returnBook(self):
        self.book.returned()
        self.status = 'returned'
        super().save()
        
    def accept(self):
        if self.book.quantity < 1:
            self.status = 'book unavailable'
            return False

        self.status = 'active'
        self.book.rented()
        self.expiry = timezone.now() + timedelta(days=self.duration*7)
        super().save()
        return True

    def cancel(self):
        self.status = 'cancelled'

        super().save()



class Contract_updater(models.Model):
    contract = models.ManyToManyField(Contract, blank=True)
    date = models.DateField(blank=True, default=timezone.now)

    def save(self, *args, **kwargs):
        print(self.date)
        try:
            if Contract_updater.objects.latest('pk').date != self.date:
                return
        except ObjectDoesNotExist:
            pass


        contract_late = Contract.objects.filter(expiry__lte=self.date, status='active')
        if contract_late:
            contract_late.update(status='late')
            for contract in contract_late:
                contract.save()
            self.contract_set.add(contract_late)
        
        expired_waiting = Contract.objects.filter(expiry__lte=self.date, status='waiting')
        if expired_waiting:
            expired_waiting.update(status='expired')
            for contract in expired_waiting:
                contract.save()
            self.contract_set.add(expired_waiting)

        super().save()