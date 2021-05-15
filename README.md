<h1 align="center"> CONSTRUE </h1>
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



## 🌵 Folder Structures
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
└── manage.py

```
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project"> ➤ About The Project</a></li>
    <li><a href="#prerequisites"> ➤ Prerequisites</a></li>
    <li><a href="#folder-structure"> ➤ Folder Structure</a></li>
    <li><a href="#dataset"> ➤ Dataset</a></li>
    <li><a href="#roadmap"> ➤ Roadmap</a></li>
    <li>
      <a href="#preprocessing"> ➤ Preprocessing</a>
      <ul>
        <li><a href="#preprocessed-data">Pre-processed data</a></li>
        <li><a href="#statistical-feature">Statistical feature</a></li>
        <li><a href="#topological-feature">Topological feature</a></li>
      </ul>
    </li>
    <!--<li><a href="#experiments">Experiments</a></li>-->
    <li><a href="#results-and-discussion"> ➤ Results and Discussion</a></li>
    <li><a href="#references"> ➤ References</a></li>
    <li><a href="#contributors"> ➤ Contributors</a></li>
  </ol>
</details>


## Construe_frontend (ReactApp)
##### BookPage.js
features: - like/dislike book
          - reserve book
      
