from books.models import Contract
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user

class IsStaffOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user.is_staff or request.user == obj.user


class fiveBookLimit(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_staff:
            return Contract.objects.filter(user=request.user, status__in=['waiting', 'active', 'late']).count() < 6
        
        return True