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


// Search a play 

  // const searchPlays = () => {
  
  //    return Play.find({$text: {$search: searchinput}})

  //   // .populate("playsInstances")
  // }


//home page
router.get("/", async (req, res) => {
  console.log(req.body)

        let allPlays = await getAllPlays()
        // Play.find({}, (err, allPlays) => {
        res.render("index", { title: "Home", user: req.user, allplays: allPlays })

})

router.post("/", async (req, res) => {
  console.log(req.body.searchinput)
   let searchinput = req.body.searchinput
   let allPlays
   let totalPlays = []

   let allplayinstances
      if (searchinput != "") {
       const allplays = await Play.find({$or:[{title : {$regex : String(searchinput)}}, {production : {$regex : String(searchinput)}} ]}).populate("playsInstances")
       

       const allplayInstances = await PlayInstance.find({summary: {$regex : String(searchinput)}})
       
       for (var i = 0; i < allplayInstances.length; i++) {
         let newPlay = await Play.find({"playsInstances": allplayInstances[i]._id}).populate("playsInstances")
          // console.log(newPlay)

          totalPlays.push(newPlay[0])
       }

       let fullPlays = allplays.concat(totalPlays) 
       const uniquePlays = Array.from(new Set(fullPlays.map(a => a.id))).map(id => {
              return fullPlays.find(a => a.id === id)
                    })
       
        res.render("index", { title: "Home", user: req.user, allplays: uniquePlays, allplayInstances: allplayinstances})
      }else{
        let allPlays = await getAllPlays()
        // Play.find({}, (err, allPlays) => {
        res.render("index", { title: "Home", user: req.user, allplays: allPlays, allplayInstances: allplayinstances})

          }   
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
