<h1 id="construe" align="center"> CONSTRUE </h1>
<h3 align="center"> Library Management System </h3>

Construe helps you look after the book you wanted, check availability and reserve your book before going to the Library.


### Dependencies
<a href="https://python.org" target="_blank"><img src="https://img.shields.io/badge/Python-3.6++-green" /></a>
<a href="https://www.djangoproject.com/"><img src="https://img.shields.io/badge/Django-3.2-green" /></a>
<a href="https://www.django-rest-framework.org/"><img src="https://img.shields.io/badge/django--rest--framework-3.12-green" /></a>

#### React Development Dependencies (optional)
you dont need this to run the app
<a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Nodejs-15.6.0-green" /></a>
<a href="https://reactjs.org"><img src="https://img.shields.io/badge/React-17.0.2-green" /> </a>
<a href="https://reactrouter.com/"><img src="https://img.shields.io/badge/react--router--dom-5-green" /></a>


<h2 id="contents">Table of Contents</h2>
<details open>
  <summary>show</summary>
    <ol>
      <li><a href="#construe">CONSTRUE</a></li>
      <li><a href="#contents">Table of Contents</a></li>
    </ol>
</details>



<h2 id="folders"> 🌵 Folder Structures </h2>

<details open>
  <summary>show</summary>
  
    ```
    construe
    │
    ├── books               # rest APIs
    │     ├── models.py 
    │     ├── views.py
    │     ├── serializers.py
    │     ├── permissions.py
    │     ├── utils.py
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


<h2 id="construe-frontend">Construe_frontend (ReactApp)</h2>
##### BookPage.js
features: - like/dislike book
          - reserve book


<h2 id="how-to-run">How to Run</h2>
install requirements `-pip install -r requirements.txt`

run the server
```
-python manage.py makemigrations
-python manage.py migrate
-python manage.py runserver
```
create superuser for admin page
```
-python manage.py createsuperuser
```
      
