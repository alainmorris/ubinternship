# ubinternship
Internship Project for UB

To get this app working you must first ensure that you have all the files in a folder

From CMD, you should navigate to the folder that all these files are in using cd.

Once in the directory, type npm install express.

do npm install for all of these:
router
path
mongoose
body-parser


In its current state, this app can connect to a local database and insert into a collection. To work with your PC, you must go to line 12 in server.js and change the /alaindb to the name of your database.

Also, to work within one of your collections, you must go to line 22 and change the first parameter of function model to the name of your collection.

With those changes you can insert into your local database.

To access the routes there are no changes that need to be made. Simply try them out with

localhost:5000/contact
localhost:5000/about
