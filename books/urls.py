from django.urls import path

from .views import (CommentView, ContactUsDetail, ContactUsView, book_detail, 
book_like, book_list, contractDetail, contract_list, CommentsView, new_books)

urlpatterns = [
    path('books/', book_list.as_view()),            # return a default book list
    path('books/<str:pattern>/', book_list.as_view()), # return a filtered book list according to pattern
    path('book/<int:pk>/', book_detail.as_view()),  # return a detailed book information for the book page
    path('book/<int:pk>/<str:like>/', book_like),   # request PATCH to like/dislike book
    path('newbooks/', new_books.as_view()),         # return 5 newest added books
    path('comment/<str:group>/<int:pk>/', CommentsView.as_view()),  # comment list of certain book page, request POST to create comment
    path('comment_detail/<int:pk>/', CommentView.as_view()),        # update/ delete comment
    path('contracts/', contract_list.as_view()),                    # list of contract of current user (all contracts for staff)
    path('contract/<int:pk>/<str:command>/', contractDetail.as_view()), # accept/cancel/retrieve book from contract (for staff only)
    path('contactus/', ContactUsView.as_view()),                        # list of contact us messages from current user
    path('contactus/<int:pk>/', ContactUsDetail.as_view())              # return the message detail and also its replies
]