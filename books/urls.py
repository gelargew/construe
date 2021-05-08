from django.urls import path

from .views import CommentView, ContactUsView, book_detail, book_like, book_list, contractDetail, contract_list, CommentsView, new_books

urlpatterns = [
    path('books/', book_list.as_view()),
    path('books/<str:pattern>/', book_list.as_view()),
    path('book/<int:pk>/', book_detail.as_view()),
    path('book/<int:pk>/<str:like>/', book_like),
    path('newbooks/', new_books.as_view()),
    path('comment/<str:group>/<int:pk>/', CommentsView.as_view()),
    path('comment_detail/<int:pk>/', CommentView.as_view()),
    path('contracts/', contract_list.as_view()),
    path('contract/<int:pk>/<str:command>/', contractDetail.as_view()),
    path('contactus/', ContactUsView.as_view())

]