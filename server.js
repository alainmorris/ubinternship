const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');
var mongoose  = require('mongoose');


var application_root = __dirname


mongoose.connect('mongodb://localhost:27017/alaindb', {useNewUrlParser: true, useUnifiedTopology: true});

var formSchema = new mongoose.Schema({
	Name: String,
	Password: String,
	Gender: String,
	Email: String
})


var form = mongoose.model("onlineforms", formSchema);


app.use(router);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router.get('/', function (req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});
router.get('/contact', function (req,res){
	res.sendFile(path.join(__dirname+'/contact.html'));
});
router.get('/about', function (req,res){
	res.sendFile(path.join(__dirname+'/about.html'));
});
	
app.post('/', function (req,res){
	console.log(req.body);
	var newForm = {
		Name: req.body.name,
		Password: req.body.password,
		Gender: req.body.gender,
		Email: req.body.email
	};
	console.log(newForm);
	
	form.create(newForm,
	function(err, newlyCreated){
		if(err){
			console.log(err);
			
		} else{
			console.log(newlyCreated);
			res.redirect('/');
		}
	});
})

app.listen(5000,function(){
	console.log('Example app listening on port 5000!');
})

