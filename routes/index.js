const express = require("express")
const router = express.Router()
const { ensureAuthenticated } = require("../config/auth.js")
const { getAllPlays, getOnePlay } = require("../controllers/plays-controller.js")
const { getUserAndReviews, getUserWishlistAndReviews } = require("../controllers/users-controller.js")
const { Review } = require("../models/review.js")
const User = require('../models/user')
const { Wishlist } = require("../models/wishlist.js")
const Theater = require("../models/theater").Theater
// const playId = req.params.ObjectId
// const playsInstancesId = req.params.ObjectId
// const dotenv = require(“dotenv”);
// dotenv.config();

//home page
router.get("/", async (req, res) => {
  let allPlays = await getAllPlays()
  let user
  if (req.user) {
    user = await User.findOne({_id: req.user._id}).populate('wishlist')
  }
  // Play.find({}, (err, allPlays) => {
  res.render("index", { title: "Home", user: user || req.user, allplays: allPlays })
  // })
})

// signup page
router.get("/signup", (req, res) => {
  res.render("signup", {
    layout: "layouts/no-footer",
    title: "Sign up",
    user: req.user,
  })
})

// play page
router.get("/play/:PlayId/:playInstanceId", async (req, res) => {
  const playId = req.params.PlayId
  const playInstanceId = req.params.playInstanceId

  let onePlay = await getOnePlay(playId, playInstanceId)
  const user = req.user ? await getUserWishlistAndReviews(req.user) : undefined

  res.render("play", { title: "Plays", user, play: onePlay, baseURL: req.baseUrl })
})

//// play review page
router.get("/playreview", (req, res) => {
  res.render("playreview", { title: "Reviews", user: req.user })
})

//signup confirmation page
router.get("/signupconfirm", (req,res) => {
  res.render("signupconfirm", {title: "Sign up Confirmation", layout: "layouts/no-footer", user: req.user,  })
})

//profile page 
// router.get("/profile", (req, res) => {
//   res.render("profile", {title:"Profile page"})
// })

//wishlist page
// router.get("/wishlist", (req,res) => {
//   res.render("wishlist", {title:"Wishlist"})
// } )

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

module.exports = router
