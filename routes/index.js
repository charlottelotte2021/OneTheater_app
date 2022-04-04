const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/auth.js")

// const dotenv = require(“dotenv”);
// dotenv.config();


//home page
router.get('/', (req,res)=>{
    res.render("index", { title: "Home" })
})


// signup page
router.get('/signup', (req,res)=>{
    res.render("signup", { layout: "layouts/no-footer", title: "Sign up" })
})





// router.post('/index',ensureAuthenticated,(req,res)=>{
// res.render('index',{
// user: req.user
// })
// })

module.exports = router; 