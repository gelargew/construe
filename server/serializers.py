from rest_framework import serializers
from django.conf import settings
from django.contrib.auth.models import User
from PIL import Image

from .models import Book, Category


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

    def create(self, validated_data):
        category = validated_data.pop('category')
        book = Book.objects.create(**validated_data)
        for cat in category:
            book.category.add(cat)

        return book 