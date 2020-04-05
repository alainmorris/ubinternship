const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');
var mongoose  = require('mongoose');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var popup = require('popups');

var application_root = __dirname


mongoose.connect('mongodb://localhost:27017/alaindb', {useNewUrlParser: true, useUnifiedTopology: true});


//////////////////////////////SCHEMAS//////////////////////////////

//Schemas basically represent the structure of the document that'll be stored in the database.
var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: { type: String, unique: true },
	password: String,
	isVerified: {type: Boolean, default: false}
  });

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});


//these variables are basically creating an object that we can use to query the database and
//add to the database and the first parameter represents the collection while the second
//paramater represents the document format
var User = mongoose.model("users", UserSchema);
var Token = mongoose.model("tokens",tokenSchema);

app.use(express.static(path.join(__dirname, '/')));
app.use(router);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


router.get('/', function (req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/login', function (req,res){
	res.sendFile(path.join(__dirname+'/login.html'));
});
app.get('/confirmation',function(req,res){
	//grabbing the token part of the url
	var lastChar = req.url.charAt(req.url.length);
	var tokenArray = req.url.split('=').pop().split(lastChar);
	var tokenn = tokenArray.join("");

//finding a token that matches the user
    Token.findOne({ token: tokenn }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token may have expired.' });
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId}, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verifying and saving the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
})


////////////////////////POST////////////////////////////////
  
 app.post('/register', function (req,res){
	 console.log(req.body);
	 console.log(req.body.i_fname);
	 console.log(req.body.i_lname);
	 console.log(req.body.i_password);
	 console.log(req.body.i_email);
   // Making sure this account doesn't already exist
	User.findOne({ email: req.body.i_email }, function (err, user) {
   
	  // Making sure user doesn't already exist
	  if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
   
	  // Creating and saving the user
	  user = new User({ firstName: req.body.i_fname, lastName: req.body.i_lname, email: req.body.i_email, password: req.body.i_password });
	  user.save(function (err) {
		  if (err) { return res.status(500).send({ msg: err.message }); }
   
		  // Creating a verification token for this user
		  var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
   
		  // Saving the verification token in db
		  token.save(function (err) {
			  if (err) { return res.status(500).send({ msg: err.message }); }
   
			  // Send the email using nodemailer
			  var transporter = nodemailer.createTransport({
				pool: true,
				service: 'gmail',
				port: 465,
				secure: true,
				auth: {
				  user: 'alainpsedb@gmail.com',
				  pass: 'password123qwerty'
				}
			  });

			  var customUrl = "http://localhost:5000/confirmation/?token="+token.token;

			  var mailOptions = { from: 'Alain <alainpsedb@gmail.com>', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: '+customUrl+ '.\n' };
			  transporter.sendMail(mailOptions, function (err) {
				  if (err) { return res.status(500).send({ msg: err.message }); }
				  res.status(200).send('A verification email has been sent to ' + user.email + '.');
			  });
		  });
	  });
	});
})

app.post('/login', function(req,res){
	//check if user exists in the database
	User.findOne({ email: req.body.i_email }, function(err, user) {
		//if doesnt exist we send an error message
		if (!user)
			popup.alert("The email address "+ req.body.i_email + " is not associated with any user.");
		//  return res.status(401).send({ msg: 'The email address ' + req.body.i_email + ' is not associated with any account. Double-check your email address and try again.'});
 
		//if the user exists and password is equal then we redirect to welcome page
		if(user.password == req.body.i_password)
			return res.redirect('/login');
		
			//else we give a message that says email or password is invalid
		else{
			popup.alert("Invalid Email or Password");
			// return res.status(401).send({msg: 'Invalid email or password'});
		}
    });
})



app.listen(5000,function(){
    console.log(application_root);
    console.log('Example app listening on port 5000!');
    
})

