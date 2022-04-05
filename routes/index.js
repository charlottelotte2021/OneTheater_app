const express = require("express")
const router = express.Router()
const { ensureAuthenticated } = require("../config/auth.js")
const Play = require("../models/play").Play
const PlayInstance = require("../models/playInstance").PlayInstance
const Theater = require("../models/theater").Theater
// const playId = req.params.ObjectId
// const playsInstancesId = req.params.ObjectId
// const dotenv = require(“dotenv”);
// dotenv.config();

const getAllPlays = () => {
  return Play.find({}).populate("playsInstances")
}

const getOnePlay = async (playId, playInstanceId) => {
  const p = await Play.findById(playId)
  const pI = await PlayInstance.findById(playInstanceId)
  // console.log(p, pI)
  return { play: p, playInstance: pI }
}

//home page
router.get("/", async (req, res) => {
  let allPlays = await getAllPlays()
  // Play.find({}, (err, allPlays) => {
  res.render("index", { title: "Home", user: req.user, allplays: allPlays })
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
  //  console.log(onePlay)
  res.render("play", { title: "Plays", user: req.user, play: onePlay })
})

//// play review page
router.get("/playreview", (req, res) => {
  res.render("playreview", { title: "Reviews", user: req.user })
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
