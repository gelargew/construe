from django.contrib import admin

from .models import Book, Category, Contract, ContractUpdater, Rating, Comment


admin.site.register((Book, Category, Contract, ContractUpdater, Rating, Comment))