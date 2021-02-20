#K-Pauli test

####How to Run

```
-pip install numpy django
-py manage.py makemigrations
-py manage.py migrate
-py manage.py runserver
```

this is an arithmetic test web application based on Kraepelin-pauli-test, a one page  test consists of thousands of numbers that is verticaly separated by an input field. Test takers only need to fill the input with the last digit sum of the number exactly above and exactly below it.

application features :
    -autosave, the answers will be saved every few seconds to the database using PUT API so user can come back to the test within 2 hours.
    -autofocus, test takers only need to type a number and will be immediately focused to the next input.
    -test window, the test window will only show a few column of numbers at a time, the earliest column would disappear and a new column will appear everytime another column is finished, so it would feel like endless.
    -history page, user can see all or just the user tests history.
    -result page, a line chart of correct, wrong and empty answers to its column using chartjs and a scatter-like map of user   answers created using bootstrap progress to make it easy to read.

in the pauli/urls.py. the landing page will be the index page if the user is logged in, otherwise the login page. all of the pages will extends layout.html that gives navbar to all the website pages. The navbar consists of website name on the left, and on the right is links to home/index, tests history and a logout button, these links will be hidden on the test page. The index page will have a brief introduction on how the test works, a button for small test, and a button for large test which bring the user to the corresponding test page. On the test page, a timer will appear and the user will immediatelly start the test, this page only consists of numbers, inputs and a finish button. The test will finish when the timer ends or the user click the finish button, which will take the user to the finish page consists of only a link to home/index page and a link to the user tests history  page. 

In the history page is a list of test result links, sorted by date. on each link the user can see the type of test (large/small), who take the test, and when it is submitted. The result page consists of some test details on top (test id, date, time left, test takers) and then below it is a graphical representation of user answers. A stacked line chart describes answers rate of each columns and then a colored map of user answers.

In models.py there are only 2 models, an AbstractUser and a Quiz model.A quiz object has all the data of each individual test particularly the ForeignKey that connect it to a user, an answers will be a string of numbers separated by comma, result is the score of the test, time is a test countdown in milliseconds, timeleft is a helper when the test finish. Quiz also have some helper method to retrieves useful data like serialization and quiz dimension.

in views.py because there are only 2 test types, both of them have similar but separate render function for large and small test. in each of them will check if user have done the test but haven't submitted it in the last 2 hours, if that the case the function direct the user to that test. otherwise create a new test. the history function will get all the quizzes/tests objects that will be rendered. The result function will get a quiz object and then create some arrays to provide data for the chart and map. The save_answers will retrieve a PUT request and overwrite the test data with the most recent one. The filled_ans function will retrieve a quiz_id in a GET request and return a JsonResponse of the user cached answers of that particular quiz. Get_chart_data will retrieve a GET API and return 3 arrays for each correct, wrong and empty answers to create the Stackedline chart.

In util.py is some useful function to proccess and retrieves some data like get_quiz to get an array of random numbers and its answers, result function will calculate the user score based on correct and wrong answers, chart_data will return 3 arrays which is a correct, wrong, and empty answer rate for each columns. text_is_expired to check if test is within 2 hours and filled_answer to return input that already been filled by the user.

in pauli/static/pauli there are 4 files. test.js will take care of the test page interaction, the first few lines will hide the link in the navigation bar and show the first 6 columns of numbers, the fetch function will get the answers from the recent unfinished test and prefill the input element, then for each of those input is given an 'input' eventlistener so the focus will change to the next input everytime a value is inputted. The setInterval will take care of the timer and call the save_answer function every 30 seconds. 