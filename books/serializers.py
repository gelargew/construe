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
    quantity = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ('id', 'likes', 'category', 'title', 'author', 'description', 'added', 'year', 'quantity', 'image', 'slug')

    def get_likes(self, book):
        return {'count': book.like.count(), 'dislikes': book.dislike.count()}

    def get_quantity(self, book):
        return book.quantity - Contract.objects.filter(book_id=book.id, status__in=('waiting', 'active', 'late')).count()

    
class ContractSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    book = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = '__all__'

    def get_book(self, obj):
        return {'id': obj.book.id, 'title': obj.book.title}


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
    timestamp = serializers.SerializerMethodField()
    
    class Meta:
        model = ContactUs
        fields = ('id', 'user', 'message', 'timestamp', 'reply_count', 'title')

    def get_reply_count(self, obj):
        return obj.replies.all().count()

    def get_timestamp(self, obj):
        return obj.timestamp


class ContactUsDetailSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = ContactUs
        fields = '__all__'

    def get_replies(self, obj):
        return [ContactUsSerializer(object).data for object in obj.replies.all()]