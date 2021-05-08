from django.contrib.auth.models import User
from rest_framework import serializers



class UserSerializer(serializers.ModelSerializer):
    contracts = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_staff', 'is_authenticated', 'contracts')

    def get_contracts(self, user):
        return [contract.book_id for contract in user.contracts.all()]



class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
        ordering = ('username',)
