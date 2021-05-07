from django.contrib import admin

from .models import Book, Category, Contract, ContractUpdater, Comment


class BookAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title', )}


admin.site.register((Category, Contract, ContractUpdater, Comment))
admin.site.register(Book, BookAdmin)