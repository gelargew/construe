from django.urls import path
from django.urls.conf import include
from django.conf import settings
from django.conf.urls.static import static

from .views import book_create, book_list, contract_create, contract_list, contract


urlpatterns = [
    path('books/', book_list.as_view()),
    path('books/<str:pattern>/', book_list.as_view()),
    path('book/create/', book_create.as_view()),
    path('contracts/', contract_list.as_view()),
    path('contract/create/', contract_create),
    path('contract/<str:type>/<int:pk>/', contract)
] 