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
    author = models.CharField(max_length=100, null=True, blank=True)
    category = models.ManyToManyField(Category, related_name='books', blank=True)
    description = models.TextField(blank=True, default='no description')
    added = models.DateTimeField(auto_now_add=True)
    year = models.CharField(null = True, blank=True, max_length=50)
    quantity = models.IntegerField(default=1)
    image = models.ImageField(upload_to='images/', blank=True, null=True)

    class Meta:
        ordering = ('title',)

    def __str__(self) -> str:
        return f'{self.title}'

    def returned(self):
        self.quantity += 1
        super().save()

    def rented(self):
        self.quantity -= 1
        super().save()


def get_default_time():
    return (timezone.now() + timedelta(days=1)).date()

class Contract(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    book = models.ForeignKey(Book, on_delete=models.PROTECT)
    expiry = models.DateField(default=get_default_time, blank=True)
    status = models.CharField(choices=CONTRACT_STATUS, default='waiting', max_length=36)
    duration = models.IntegerField(default=1, blank=True)

    class Meta:
        ordering = ['expiry', '-status']

    def __str__(self) -> str:
        return f'{self.user} book: {self.book.title} status: {self.status} {self.expiry}'  

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
    """
    this model will update active and waiting contracts that has been expired, 
    the updated contracts will be written in this model as an update history
    """
    contracts = models.ManyToManyField(Contract, blank=True)
    date = models.DateField(blank=True, default=timezone.now)

    class Meta:
        verbose_name = 'Daily update'

    def __str__(self) -> str:
        return f'{self.date}'

    def save(self, *args, **kwargs):
        contract_late = Contract.objects.filter(expiry__lte=self.date, status='active')
        if contract_late:
            contract_late.update(status='late')
            for contract in contract_late:
                contract.save()
            self.contracts.add(contract_late)
        
        expired_waiting = Contract.objects.filter(expiry__lte=self.date, status='waiting')
        if expired_waiting:
            expired_waiting.update(status='expired')
            for contract in expired_waiting:
                contract.save()
            self.contracts.add(expired_waiting)

        super().save()



class Rating(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(null=True, default=0, blank=True)

    def __str__(self) -> str:
        return f'{self.user.username} {self.rating} {self.book.title}'


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    body = models.CharField(max_length=300, )

    class Meta:
        ordering = ('-date',)
        verbose_name = 'Comment'

    def __str__(self) -> str:
        return f'{self.date} ==== by: {self.user} ==== {self.body[:20]}'

