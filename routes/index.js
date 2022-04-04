const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/auth.js")
const Play = require("../models/play").Play

// const dotenv = require(“dotenv”);
// dotenv.config();


//home page
router.get('/', (req,res)=>{
    res.render('index');
Play.find({}, (err, allPlays) => {
    res.render('index', {allplays: allPlays});
  })    
})


// signup page
router.get('/signup', (req,res)=>{
    res.render('signup');
})


// router.get('/', (req,res)=>{
//   Play.find({}, (err, allPlays) => {
//     res.render('index', {allplays: allPlays});
//   })
// })



// router.post('/index',ensureAuthenticated,(req,res)=>{
// res.render('index',{
// user: req.user
// })
// })

module.exports = router; 