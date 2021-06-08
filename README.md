## Distinctiveness and Complexity
This project is a library management system to help library users and librarian with the proccess of borrowing book. There are 5 main models in this project: ***Book***, ***Comment***, ***Contract***, ***User***, ***ContractUpdater***. it is similar to an e-commerce site but instead of buying products, user can create a contract to reserve a book. the contract model has 4 main statuses: ***waiting***,  means the contract is waiting for user to take the book and accepted by staff, ***expired*** mean the waiting time has expired and the contract become not eligible, ***active*** mean the staff has accepted the contract, the book is in the user hand and need to be returned before the due date, ***late*** mean the book has not been returned after the due date have passed.

**ContractUpdater** is a daily updater that whenever saved, it checks the date on waiting, and active contracts and change its status based on its expiration date and current date. It is not exactly a daily update, it will be created whenever a staff authenticate/visit the website and no **ContractUpdater** already present in the current date.



<details>
  <summary>folder structures</summary>
  List of important files to look for
  
    ```
    construe
    │
    ├── books               # rest APIs
    │     ├── models.py 
    │     ├── views.py
    │     ├── serializers.py
    │     ├── permissions.py
    │     ├── utils.py
    │     ├── urls.py
    │     └── ...
    │ 
    ├── construe
    │     ├── settings.py
    │     └── ...
    │
    ├── construe_frontend   #react frontend
    │     ├── src
    │     │    └── Components
    │     │            ├── App.js
    │     │            ├── Auth.js
    │     │            ├── BookPage.js
    │     │            ├── Comments.js
    │     │            ├── Header.js
    │     │            └── ...
    │     │
    │     ├── static
    │     ├── templates
    |     └── ...
    |
    ├── users     
    │     ├── models.py 
    │     ├── views.py
    │     ├── serializers.py
    │     └── ...
    │
    ├── manage.py
    └── reuirements.txt
    ```
</details>

## What's contained in each file
#### books/models.py
- Book model contain common field such as title, description, author, slug and category. The quantity field will determine if the book currently available and can be reserved.
- Contract model have a UniqueConstraint Meta class where a user can't have 2 contracts with the same book. the save() method will extend the expiry if the status changed to active.
- Comment model contain common field such as book(which book page this comment is in), user, body, timestamp, reply(which comment is this comment/reply is in). The reply comment will have a **None** book field and a relation to a book comment and Book comment will have **None** reply field and a book object.
- ContractUpdater have a contracts ManyToManyField where it stores all the contracts that has been automatically updated at the at the current date.
- ContactUS model is similar to Comment, just different table.

#### books/serializers.py
Most of the ModelSerializer use a default django-rest-framework settings. in BookSerializer, get_quantity method will substract the actual book quantity with the book active + waiting contracts 

#### books/permissions.py & books/utils.py
these files provide some helper function for the views.py like custom permissions and validators.

#### books/views.py
Most of the views in this file are created using django rest framework generic views. The get_queryset() method in book_list class optionally take an argument 'pattern' to filter the books before its get returned as a response. The get_queryset() method in **CommentsView** takes 2 arguments 'group' and 'pk'. if the group is 'replies' then the pk is a comment_id thus will return comment objects that has reply relation to the comment with the given id, if the groupd is 'comments' then the pk will be a book_id thus will return comment objects with a relation to the book. The same thing is also applied to the perform_create() method.

#### construe_frontend/
this is the frontend part of the apps, the index() view in views.py will render html with an empty div templates/construe_frontend/index.html with a script that link to static/construe_frontend/main.js. inside main.js is a bundling of react components from src/components.js folder.

#### construe_frontend/src/components/
In ***App.js*** the user state is being passed as a global state **userContext** with help of createContext() and contextProvider.
***Auth.js*** provides LoginPage and RegisterPage component
##### BookPage.js
BookPage have  a reserve book button for authenticated user that will triger a **rentBook** function and render ***ContractBox*** component. in ***ContractBox*** there is a function **toggle** that will check the class name of the clicked div, if its not a 'box-layout'(in this case outside of the contract box) it will unmount the **ContractBox** component.

##### ContactPage.js







<h2 id="dependencies">:cd: Dependencies</h2>
<a href="https://python.org" target="_blank"><img src="https://img.shields.io/badge/Python-3.6++-green" /></a>
<a href="https://www.djangoproject.com/"><img src="https://img.shields.io/badge/Django-3.2-green" /></a>
<a href="https://www.django-rest-framework.org/"><img src="https://img.shields.io/badge/django--rest--framework-3.12-green" /></a>

#### React Development Dependencies (optional)
<a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Nodejs-15.6.0-green" /></a>
<a href="https://reactjs.org"><img src="https://img.shields.io/badge/React-17.0.2-green" /> </a> <br>
this is only needed if the javascript need to be changed, refer to [frontend](/construe_frontend) page for more detail to run the react development mode.


<h2 id="how-to-run">:zap: How to Run</h2>

install requirements

```
-pip install -r requirements.txt
```

run the server

```
-python manage.py makemigrations books
-python manage.py migrate
```
create superuser for admin page

```
-python manage.py createsuperuser
-python manage.py runserver
```

login with superuser account, there should be an administrator button to go to the admin page. then create some book samples(only book title is required to save a book object).
back to the main page to try its features.


