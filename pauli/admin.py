from django.contrib import admin

from .models import *

# Register your models here.

class QuizInline(admin.TabularInline):
    model = Quiz


class UserAdmin(admin.ModelAdmin):
    inlines = [
        QuizInline
    ]

admin.site.register(Quiz)
admin.site.register(User, UserAdmin)