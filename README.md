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
nodemailer
crypto

This app allows a user to enter his/her information and signup with an email and a password.
Once they click signup a confirmation link will be sent to their email.
Once they click on the confirmation link their account will be verified.

This app uses a token that will be stored in the database that corresponds to the user's userID in the database. This same userID will be used in the link and when they click on it, the server processes the get request and checks for the userID and finds if there is a user with that ID then sets their "isverified" property to true.

THIS APP BUILDS ON THE REGISTRATION COMPONENT PREVIOUSLY BUILT

The app now tracks the user's information on login and provides them with their name upon login and when they last logged in. On first login, the user should have the current date and time as their last logged in.

