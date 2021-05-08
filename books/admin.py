from django.contrib import admin

from .models import Book, Category, Contract, ContractUpdater, Comment


class BookAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title', )}
    search_fields = ['title', 'author']


class ContractAdmin(admin.ModelAdmin):
    search_fields = ['user__username', 'book__title', 'user__email']


admin.site.register((Category, Contract, ContractUpdater, Comment))
admin.site.register(Book, BookAdmin)