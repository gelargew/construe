from rest_framework import serializers
from django.db.models import Avg

from .models import Book, Category, Comment, ContactUs, Contract


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
        fields = ('id', 'likes', 'category', 'title', 'author', 'description', 'added', 'year', 'quantity', 'image', 'slug')

    def get_likes(self, book):
        return {'count': book.like.count(), 'dislikes': book.dislike.count()}

    
class ContractSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    book = serializers.StringRelatedField()

    class Meta:
        model = Contract
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    reply_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_reply_count(self, obj):
        return obj.replies.all().count()


class ContactUsSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    reply_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ContactUs
        fields = ('id', 'user', 'message', 'timestamp', 'reply_count')

    def get_reply_count(self, obj):
        return obj.replies.all().count()


class ContactUsDetailSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = ContactUs
        fields = '__all__'

    def get_replies(self, obj):
        return [ContactUsSerializer(object).data for object in obj.replies.all()]