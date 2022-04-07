const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { ObjectId } = require("mongodb")
const bcrypt = require("bcrypt")
const passport = require("passport")
const { ensureAuthenticated } = require("../config/auth.js")
const User = require("../models/user")
const { Wishlist } = require("../models/wishlist")
const { Review } = require("../models/review")

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
                    // console.log(value)
                    req.flash("success_msg", "You are now registered!")
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
router.get("/wishlist", ensureAuthenticated, (req, res) => {
  res.render("wishlist", { title: "Wishlist", user: req.user })
})

router.post(
  "/wishlist/:playInstanceId",
  ensureAuthenticated,
  async (req, res) => {
    const user = req.user

    if (ObjectId.isValid(req.params.playInstanceId)) {
      const WishlistItem = new Wishlist({
        playInstanceId: ObjectId(req.params.playInstanceId),
      })
      await WishlistItem.save()

      await User.findByIdAndUpdate(user._id, {
        $push: { wishlist: WishlistItem._id },
      })
      res.send({
        status: `Added play ${WishlistItem.playInstanceId} to wishlist`,
      })
    } else {
      res.status(500).send({ status: "Not a valid id" })
    }
  }
)

router.delete(
  "/wishlist/:playInstanceId",
  ensureAuthenticated,
  async (req, res) => {
    const user = req.user
    const playInstanceId = req.params.playInstanceId

    if (ObjectId.isValid(playInstanceId)) {
      const wishlistItems = await Wishlist.find({
        playInstanceId: playInstanceId,
      })
      const dbUser = await User.findOne({ _id: user._id }).populate("wishlist")

      const wishlistItemsIds = wishlistItems.map((item) => item._id.toString())
      for (let id of wishlistItemsIds) {
        if (dbUser.wishlist.find((obj) => obj._id.toString() === id)) {
          // if the id of the wishlistItem is present within the user's wishlist
          await Wishlist.deleteOne({ _id: id }) // delete the entry from the Wishlist collection
          await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { wishlist: id } }
          ) // delete the reference in the user's wishlist
          break
        }
      }

      res.send({ status: `Removed play ${playInstanceId} from wishlist` })
    } else {
      res.status(500).send({ status: "Not a valid id" })
    }
  }
)

//profile page - update information

router.post("/profile", ensureAuthenticated, async (req, res) => {
  const loggedUser = req.user
  const { username, email, password, password2 } = req.body
  let errors = []

  const updatedUser = {}

  if (req.body.username) updatedUser.username = req.body.username
  if (req.body.email) updatedUser.email = req.body.email
  if (req.body.password) updatedUser.password = req.body.password

  //check if all fields are filled
  // if(!username || !email || !password || !password2) {
  //     errors.push({ msg : "Please fill in all fields" })
  // }
  //check if passwords match
  if (password !== password2) {
    errors.push({ msg: "The passwords don't match" })
  }
  //check if the password has at least 6 characters
  if (password && password.length < 6) {
    errors.push({ msg: "Your password should be at least 6 characters long" })
  }

  if (errors.length > 0) {
    res.render("profile", {
      errors: errors,
      username: username,
      email: email,
      password: password,
      password2: password2,
      title: "Profile page",
      user: req.user,
    })
  } else {
    //check if the e-mail already exists
    User.findOne({ email }).exec(async (err, user) => {
      if (user) {
        errors.push({
          msg: `An account with the email ${email} already exists`,
        })

        res.render("profile", {
          errors: errors,
          username: username,
          email: email,
          password: password,
          password2: password2,
          title: "Profile page",
          user: req.user,
        })
      } else {
        //check if username already exists
        User.findOne({ username }).exec(async (err, user) => {
          if (user) {
            errors.push({
              msg: `An account with the name ${username} already exists, please choose another one.`,
            })

            res.render("profile", {
              errors: errors,
              username: username,
              email: email,
              password: password,
              password2: password2,
              title: "Profile page",
              user: req.user,
            })
          } else {
            if (updatedUser.password) {
              bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                  if (err) throw err
                  //save pass to hash
                  updatedUser.password = hash
                  
                  User.findByIdAndUpdate({ _id: req.user._id }, updatedUser)
                    .then(() => {
                      req.flash(
                        "success_msg",
                        "Your profile has been successfully updated!"
                      )
                      res.redirect("/users/profile")
                    })
                    .catch((value) => console.log(value))
                })
              )
            } else {
              User.findByIdAndUpdate({ _id: req.user._id }, updatedUser)
                .then(() => {
                  req.flash(
                    "success_msg",
                    "Your profile has been successfully updated!"
                  )
                  res.redirect("/users/profile")
                })
                .catch((value) => console.log(value))
            }
          }
        })
      }
    })
  }
})

//wishlist page
router.get("/wishlist", ensureAuthenticated, (req, res) => {
  res.render("wishlist", { title: "Wishlist", user: req.user })
})

// Reviews
const addAReview = async (req) => {
  try {
    if (ObjectId.isValid(req.params.playId)) {
      const newReview = new Review({
        userId: req.user._id,
        playId: req.params.playId,
        stars: req.body.note
      })
  
      await newReview.save()
  
      await User.findByIdAndUpdate(req.user._id, { $push: { reviews: newReview._id }})
    }
  } catch (err) {
    throw err
  }
}

// Add a review note
router.post('/review/note/:playId', ensureAuthenticated, async (req, res) => {
  try {
    const reviewExists = await Review.exists({ userId: req.user._id, playId: req.params.playId })
    if (!reviewExists) {
      addAReview(req)
    } else {
      await Review.findOneAndUpdate({ userId: req.user._id, playId: req.params.playId }, { stars: req.body.note })
    }
    res.status(200).send({ status: `Added ${req.body.note} stars to the play` })
  } catch (err) {
    res.status(500).send({ status: 'An error occurred' })
  }
})

// Add a full review
// router.post('/review/:playId', ensureAuthenticated, (req, res) => {

// })

//logout
router.get("/logout", (req, res) => {
  req.logout()
  req.flash("success_msg", "Now logged out")
  res.redirect("/users/login")
})

module.exports = router
