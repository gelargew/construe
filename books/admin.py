from django.contrib import admin

from .models import Book, Category, Contract, ContractUpdater, Rating, Comment


class BookAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title', )}


admin.site.register((Category, Contract, ContractUpdater, Rating, Comment))
admin.site.register(Book, BookAdmin)