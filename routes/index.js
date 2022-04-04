const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/auth.js")
const Play = require("../models/play").Play
const playInstance = require("../models/playInstance").playInstance
const Theater = require("../models/theater").Theater

// const dotenv = require(“dotenv”);
// dotenv.config();

const getAllPlays = () => {
  return Play.find({}).populate("playsInstances")
}

//home page
router.get('/', async (req,res)=>{
    let allPlays = await getAllPlays()
  // Play.find({}, (err, allPlays) => {
    res.render("index", { title: "Home", allplays: allPlays })
  // })    

})

// signup page
router.get('/signup', (req,res)=>{
    res.render("signup", { layout: "layouts/no-footer", title: "Sign up" })
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
