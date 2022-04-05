const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = require("../models/user.js")
const bcrypt = require("bcrypt")
const passport = require("passport")
const { ensureAuthenticated } = require("../config/auth.js")


//login handle

router.get("/login", (req, res) => {
  res.render("login", {
    layout: "layouts/no-footer",
    title: "Log in",
    user: req.user,
  })
})

//Register handle
router.get("/signup", (req, res) => {
  res.render("signup", {
    layout: "layouts/no-footer",
    title: "Sign up",
    user: req.user,
  })
})

router.post("/signup", (req, res) => {
  const { username, email, password, password2 } = req.body
  let errors = []

  // console.log(" Name " + username + " email :" + email + " pass:" + password)

  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" })
  }
  //check if match
  if (password !== password2) {
    errors.push({ msg: "The passwords don't match" })
  }

  //check if password is more than 6 characters
  if (password.length < 6) {
    errors.push({ msg: "Your password should be at least 6 characters long" })
  }

  if (errors.length > 0) {
    res.render("signup", {
      errors: errors,
      username: username,
      email: email,
      password: password,
      password2: password2,
      layout: "layouts/no-footer",
      title: "Sign up",
      user: req.user,
    })
  } else {
    //validation passed
    User.findOne({ email }).exec((err, user) => {
      // console.log(user)
      if (user) {
        errors.push({
          msg: `An account with the email ${email} already exists`,
        })
        res.render("signup", {
          errors: errors,
          username: username,
          email: email,
          password: password,
          password2: password2,
          layout: "layouts/no-footer",
          user: req.user,
          title: "Sign up",
        })
      } else {
        User.findOne({ username }).exec((err, user) => {
          if (user) {
            errors.push({
              msg: `An account with the name ${username} already exists, please choose another one.`,
            })
            res.render("signup", {
              errors: errors,
              username: username,
              email: email,
              password: password,
              password2: password2,
              layout: "layouts/no-footer",
              user: req.user,
              title: "Sign up",
            })
          } else {
            const newUser = new User({
              username: username,
              email: email,
              password: password,
            })

            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err
                //save pass to hash
                newUser.password = hash
                //save user
                newUser
                  .save()
                  .then((value) => {
                    console.log(value)
                    req.flash("success_msg", "You have now registered!")
                    res.redirect("/")
                  })
                  .catch((value) => console.log(value))
              })
            )
          }
        })
      }
    })
  }
})

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next)
})

//profile page
router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", { title: "Profile page", user: req.user })
})


//wishlist page 
router.get("/wishlist", (req,res) => {
  res.render("wishlist", {title:"Wishlist"})
} )


//profile page - update information 

router.post('/profile', ensureAuthenticated, async (req, res) => {
    console.log(req.body)
// router.post ("/profile", (req, res) => {
   
const {username,email, password, password2} = req.body;
 let errors = [];

 const updatedUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    }

    if(!username || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    } 

    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }

    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }

    if(errors.length > 0 ) {
    res.render('profile', {
        errors : errors,
        username : username,
        email : email,
        password : password,
        password2 : password2,
        title: "Profile page"})
    } else {

const user = await User.findById(req.user._id)
await User.findByIdAndUpdate({ _id: req.user._id }, updatedUser) 


bcrypt.genSalt(10, (err,salt) => 
            bcrypt.hash(user.password,salt,
                (err,hash) => {
                    if(err) throw err;
                        //save pass to hash
                        user.password = hash;
                    //save user
            user.save()
            .then((value)=>{
            console.log(value)
            req.flash('success_msg','You have now updated!')
            res.redirect("/users/profile");
                    })
            .catch(value=> console.log(value));
                      
                }));

}
}) 


//wishlist page
router.get("/wishlist", (req, res) => {
  res.render("wishlist", { title: "Wishlist", user: req.user })
})



//logout
router.get("/logout", (req, res) => {
  req.logout()
  req.flash("success_msg", "Now logged out")
  res.redirect("/users/login")
})

module.exports = router
