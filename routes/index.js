const express = require("express")
const router = express.Router()
const { ensureAuthenticated } = require("../config/auth.js")
const {
  getAllPlays,
  getOnePlay,
  getFivePlays,
  getMultiplePlaysFromInstances,
} = require("../controllers/plays-controller.js")
const { getReviewsOfPlayAndUsers, getAllReviews } = require("../controllers/reviews-controller.js")
const {
  getUserWishlistAndReviews,
  getUserAndWishlist
} = require("../controllers/users-controller.js")
const { Play }  = require("../models/play")
const { PlayInstance } = require("../models/playInstance")

//home page
router.get("/", async (req, res) => {
  let allPlays = await getAllPlays()
  const user = req.user ? await getUserAndWishlist(req.user) : undefined
  const reviews = await getAllReviews()

  res.render("index", {
    title: "Home",
    user,
    plays: allPlays,
    reviews
  })
})

// get 5 Plays 
router.post("/getfiveplays", async (req,res) => {
    // let fivePlays = await getFivePlays(req.body.limit)
    console.log(req.body.limit)
    const user = req.user ? await getUserAndWishlist(req.user) : undefined
    const play = await Play.find({}).populate("playsInstances")
    plays = play.slice(req.body.limit, req.body.limit + 5)
    const reviews = await getAllReviews()
    console.log(plays)
    console.log("ready to send next plays")
    res.send({status: "success", plays, user, reviews})
})


// signup page
router.get("/signup", (req, res) => {
  res.render("signup", {
    layout: "layouts/no-footer",
    title: "Sign up",
    user: req.user,
  })
}) 


// Search for a play
router.post("/", async (req, res) => {
  // console.log(req.body.searchinput)
  const user = req.user
    ? await getUserAndWishlist(req.user)
    : undefined
  const reviews = await getAllReviews()

  let searchinput = req.body.searchinput

  if (searchinput != "") {
    const allplays = await Play.find({
      $or: [
        { title: { $regex: String(searchinput) } },
        { production: { $regex: String(searchinput) } },
      ],
    }).populate("playsInstances")

    const allplayInstances = await PlayInstance.find({
      summary: { $regex: String(searchinput) },
    })

    const totalPlays = await getMultiplePlaysFromInstances(allplayInstances)

    let fullPlays = allplays.concat(totalPlays)


    //remove duplicates 
    const uniquePlays = Array.from(new Set(fullPlays.map((a) => a.id))).map(
      (id) => {
        return fullPlays.find((a) => a.id === id)
      }
    )

    res.render("index", {
      title: "Home",
      user,
      plays: uniquePlays,
      reviews
    })
  } else {
    let allPlays = await getAllPlays()
    res.render("index", {
      title: "Home",
      user,
      plays: allPlays,
      reviews
    })
  }
}) 

//Sort by 

router.get('/sortby/:query', async (req, res) => {
  // let allPlays = await getAllPlays()
  const user = req.user ? await getUserAndWishlist(req.user) : undefined
  const reviews = await getAllReviews()
  let sortedByDirector
  console.log(req.params)
  if(req.params.query === "director"){
   sortedByDirector = await Play.find({}).populate("playsInstances").sort({"director": -1})
   console.log(sortedByDirector)
  }


  res.render("index", {
    title: "Home",
    user,
    plays: sortedByDirector,
    reviews 
  })
})




// play page
router.get("/play/:PlayId/:playInstanceId", async (req, res) => {
  const playId = req.params.PlayId
  const playInstanceId = req.params.playInstanceId

  let onePlay = await getOnePlay(playId, playInstanceId)
  const user = req.user ? await getUserWishlistAndReviews(req.user) : undefined
  const reviews = await getReviewsOfPlayAndUsers(playId)

  res.render("play", {
    title: "Plays",
    user,
    play: onePlay,
    reviews
  })
})

//signup confirmation page
router.get("/signupconfirm", (req,res) => {
  res.render("signupconfirm", {
    title: "Sign up Confirmation",
    layout: "layouts/no-footer", 
    user: req.user, 
  })
})

//forgot password page
router.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword", {
    title: "Forgot Password",
    layout: "layouts/no-footer",
    user: req.user,
  })
})

module.exports = router