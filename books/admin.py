from django.contrib import admin

from .models import Book, Category, ContactUs, Contract, ContractUpdater, Comment


class BookAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title', )}
    search_fields = ('title', 'author')


class ContractAdmin(admin.ModelAdmin):
    search_fields = ('user__username', 'book__title', 'user__email')


class ContactUsAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('user__username', 'title')


admin.site.register((Category, ContractUpdater, Comment,))
admin.site.register(Contract, ContractAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(ContactUs)