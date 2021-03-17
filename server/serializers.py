from rest_framework import serializers
from django.conf import settings
from django.contrib.auth.models import User
from PIL import Image

from .models import Book, Category, Contract, Author


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

    def create(self, validated_data):
        author_name = validated_data.pop('author')
        author = Author.objects.get_or_create(name=author_name)[0]
        category = validated_data.pop('category')
        book = Book.objects.create(author=author, **validated_data)
        for cat in category:
            book.category.add(cat)

        return book 


class ContractSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    book = serializers.StringRelatedField()
    
    class Meta:
        model = Contract
        fields = '__all__'
        

    