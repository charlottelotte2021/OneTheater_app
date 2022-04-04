const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = require("../models/user.js")
const bcrypt = require("bcrypt")
const passport = require("passport")

//login handle

router.get("/login", (req, res) => {
  res.render("login", { layout: "layouts/no-footer", title: "Log in" })
})

//Register handle
router.get("/signup", (req, res) => {
  res.render("signup", { layout: "layouts/no-footer", title: "Sign up" })
})



router.post('/signup',(req,res)=> {
	const {username,email, password, password2} = req.body;

	let errors = [];

	console.log(' Name ' + username+ ' email :' + email+ ' pass:' + password);

	if(!username || !email || !password || !password2) {
    	errors.push({msg : "Please fill in all fields"})
	}
//check if match
	if(password !== password2) {
		errors.push({msg : "passwords dont match"});
	}

//check if password is more than 6 characters
	if(password.length < 6 ) {
    	errors.push({msg : 'password atleast 6 characters'})
	}

if(errors.length > 0 ) {
	res.render('signup', {
    	errors : errors,
    	username : username,
    	email : email,
    	password : password,
    	password2 : password2,
	layout: 'layouts/no-footer',
        title: 'Sign up'})
	} else {
    //validation passed
   	User.findOne({email : email}).exec((err,user)=> {
    console.log(user);   
    if(user) {
        errors.push({msg: 'email already registered'});
        res.render('signup', {
    	errors : errors,
    	username : username,
    	email : email,
    	password : password,
    	password2 : password2,
	layout: 'layouts/no-footer',
        title: 'Sign up'});
        
       } 
       else {
        const newUser = new User({
            username : username,
            email : email,
            password : password
        });

        bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
       newUser.save()
            .then((value)=>{
            console.log(value)
            req.flash('success_msg','You have now registered!')
            res.redirect('/');
                    })
            .catch(value=> console.log(value));
                      
                }));
}

})

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next)
})

//logout
router.get("/logout", (req, res) => {
  req.logout()
  req.flash("success_msg", "Now logged out")
  res.redirect("/login")
})

module.exports = router
