const express = require("express")
const router = express.Router()
// const { ensureAuthenticated } = require("../config/auth.js")
const {
  getPlays,
  getOnePlay,
  getMultiplePlaysFromInstances,
  getPlaysSortedByDate,
  getPlaysSortedByTheater,
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
  const plays = await getPlaysSortedByDate(5)
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

  if (req.body.location.pathname === '/') {
    let plays = await getPlaysSortedByDate(req.body.limit + 5)
    plays = plays.slice(req.body.limit, req.body.limit + 5)
    const reviews = await getAllReviews()
    
    res.send({ status: "success", plays, user, reviews })
  }
  if (req.body.location.pathname.search(/^\/sortby/) === 0) {
    if (req.body.location.pathname.search(/\/director$/) > 0) {
      let plays = await getPlays(req.body.limit + 5, { sortField: 'director', sortOrder: -1 })
      plays = plays.slice(req.body.limit, req.body.limit + 5)
      const reviews = await getAllReviews()

      res.send({ status: 'success', plays, user, reviews })
    }
    if (req.body.location.pathname.search(/\/theater$/) > 0) {
      let plays = await getPlaysSortedByTheater(req.body.limit + 5)
      plays = plays.slice(req.body.limit, req.body.limit + 5)
      const reviews = await getAllReviews()

      res.send({ status: 'success', plays, user, reviews })
    }
    if (req.body.location.pathname.search(/\/title$/) > 0) {
      let plays = await getPlays(req.body.limit + 5, { sortField: 'title', sortOrder: 1 })
      plays = plays.slice(req.body.limit, req.body.limit + 5)
      const reviews = await getAllReviews()
  
      res.send({ status: 'success', plays, user, reviews })  
    }
    if (req.body.location.pathname.search(/\/reviews$/ > 0)) {}
  }
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

  if (searchinput !== '') {
    let playsFound = await Play.find({
        $or: [
        { title: { $regex: String(searchinput), $options: 'i'} },
        { production: { $regex: String(searchinput), $options: 'i'} },
      ],
    }).populate("playsInstances")
    const playInstancesMatchedByTitleOrProduction = playsFound.map(
      (play) => play.playsInstances
    ).flat()

    const playInstancesFound = await PlayInstance.find({
      summary: { $regex: String(searchinput), $options: 'i' },
    })

    const allPlayInstancesFound = [
      ...playInstancesMatchedByTitleOrProduction,
      ...playInstancesFound,
    ]

    //remove duplicates
    const uniquePlayInstances = Array.from(new Set(allPlayInstancesFound.map((a) => a.id)))
      .map((id) => {
        return allPlayInstancesFound.find((a) => a.id === id)
      })
      .sort((a, b) => {
        return new Date(a.dateStart) > new Date(b.dateStart)
      })
    
    const plays = await getMultiplePlaysFromInstances(uniquePlayInstances)
    
    res.render("index", {
      title: "Home",
      user,
      plays,
      reviews,
    })
  } else {
    res.redirect('/')
  }
})

// Sort by
router.get("/sortby/:query", async (req, res) => {
  const user = req.user ? await getUserAndWishlist(req.user) : undefined
  const reviews = await getAllReviews()
  let sortedByDirector
  let sortedByTitle
  let sortedByTheater
  let sortedByReviews

  // console.log(req.params)
  if (req.params.query === "director") {
    sortedByDirector = await getPlays(5, { sortField: 'director', sortOrder: -1 })
    
    res.render("index", {
      title: "Home",
      user,
      plays: sortedByDirector,
      reviews,
    })
  }
  if (req.params.query === "title") {
    sortedByTitle = await getPlays(5, { sortField: 'title', sortOrder: 1 })
 
    res.render("index", {
      title: "Home",
      user,
      plays: sortedByTitle,
      reviews,
    })
  }
  if (req.params.query === "theater") {
    sortedByTheater = await getPlaysSortedByTheater(5)

    res.render("index", {
      title: "Home",
      user,
      plays: sortedByTheater,
      reviews,
    }) 
  }
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
