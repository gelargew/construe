from rest_framework import serializers
from django.db.models import Avg

from .models import Book, Category, Comment, Contract


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name',)


class BookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('pk', 'title', 'slug')


class BookSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    category = serializers.StringRelatedField(many=True)

    class Meta:
        model = Book
        fields = '__all__'

    def get_likes(self, book):
        return {'likes': book.like.count(), 'dislikes': book.dislike.count()}

    
class ContractSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    book = serializers.StringRelatedField()

    class Meta:
        model = Contract
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = '__all__'
