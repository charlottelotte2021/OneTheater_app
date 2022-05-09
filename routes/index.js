const express = require("express")
const router = express.Router()
// const { ensureAuthenticated } = require("../config/auth.js")
const {
  getAllPlays,
  getOnePlay,
  getMultiplePlaysFromInstances,
  sortPlayInstancesByDate,
} = require("../controllers/plays-controller.js")
const {
  getReviewsOfPlayAndUsers,
  getAllReviews,
} = require("../controllers/reviews-controller.js")
const {
  getUserWishlistAndReviews,
  getUserAndWishlist,
} = require("../controllers/users-controller.js")
const { Play } = require("../models/play")
const { PlayInstance } = require("../models/playInstance")
// const { Review } = require("../models/review")

// Home page
router.get("/", async (req, res) => {
  const instances = await sortPlayInstancesByDate('asc', 5)
  const plays = await getMultiplePlaysFromInstances(instances, true)
  const user = req.user ? await getUserAndWishlist(req.user) : undefined
  const reviews = await getAllReviews()

  res.render("index", {
    title: "Home",
    user,
    plays,
    reviews,
  })
})

// Get 5 plays with infinite scroll
router.post("/getfiveplays", async (req, res) => {
  const user = req.user ? await getUserAndWishlist(req.user) : undefined
  let plays = await Play.find({}).populate("playsInstances")
  plays = plays.slice(req.body.limit, req.body.limit + 5)
  const reviews = await getAllReviews()
  res.send({ status: "success", plays, user, reviews })
})

// Signup page
router.get("/signup", (req, res) => {
  res.render("signup", {
    layout: "layouts/no-footer",
    title: "Sign up",
    user: req.user,
  })
})

// Signup confirmation page
router.get("/signupconfirm", (req, res) => {
  res.render("signupconfirm", {
    title: "Sign up Confirmation",
    layout: "layouts/no-footer",
    user: req.user,
  })
})

// Search for a play
router.post("/searchplays", async (req, res) => {
  const user = req.user ? await getUserAndWishlist(req.user) : undefined
  const reviews = await getAllReviews()

  let searchinput = req.body.searchinput

  if (searchinput != "") {
    const allplays = await Play.find({
      $or: [
        { title: { $regex: String(searchinput), $options: 'i'} },
        { production: { $regex: String(searchinput), $options: 'i'} },
      ],
    }).populate("playsInstances")

    const allplayInstances = await PlayInstance.find({
      summary: { $regex: String(searchinput), $options: 'i' },
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
      reviews,
    })
  } else {
    let allPlays = await getAllPlays()
    res.render("index", {
      title: "Home",
      user,
      plays: allPlays,
      reviews,
    })
  }
})

// Sort by
router.get("/sortby/:query", async (req, res) => {
  // let allPlays = await getAllPlays()
  const user = req.user ? await getUserAndWishlist(req.user) : undefined
  const reviews = await getAllReviews()
  let sortedByDirector
  let sortedByTitle
  let sortedByTheater
  let sortedByReviews

  // console.log(req.params)
  if (req.params.query === "director") {
    sortedByDirector = await Play.find({})
      .populate("playsInstances")
      .sort({ director: -1 })
      .limit(5)
    // console.log(sortedByDirector)
 

  res.render("index", {
    title: "Home",
    user,
    plays: sortedByDirector,
    reviews,
  })
 }
  if (req.params.query === "title") {
    sortedByTitle = await Play.find({})
    .populate("playsInstances")
    .sort({title: 1})
 
  res.render("index", {
    title: "Home",
    user,
    plays: sortedByTitle,
    reviews,
  })
   }
if (req.params.query === "theater") {
      sortedByTheater = await Play.find({})
      .populate("playsInstances")
      
      .sort({name: 1})

    res.render("index", {
    title: "Home",
    user,
    plays: sortedByTheater,
    reviews,
  }) 
}

// if (req.params.query === "reviews") {
//     sortedByReviews = await Review.find({})
//     .sort({note: 1})
  
//   res.render("index", {
//     title: "Home",
//     user,
//     plays: sortedByReviews,
//     reviews,
//   }) 

//   }
})

// Play page
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
    reviews,
  })
})

// Forgot password page
router.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword", {
    title: "Forgot Password",
    layout: "layouts/no-footer",
    user: req.user,
  })
})

module.exports = router
