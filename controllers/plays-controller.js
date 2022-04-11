const { Play }  = require("../models/play")
const { PlayInstance } = require("../models/playInstance")

const getAllPlays = () => {
    return Play.find({}).populate("playsInstances").limit(5)
}

const getFivePlays = (newLimit) => {
    // let Plays = [] 
    // Play.find({}).populate("playsInstances").limit(newLimit).forEach((play) => Plays.push(play))
    // .then (() => {
    //     return Plays.splice(0, newLimit-5)
    // }
    //     )
    }

const getOnePlay = async (playId, playInstanceId) => {
    const p = await Play.findById(playId)
    const pI = await PlayInstance.findById(playInstanceId)
    // console.log(p, pI)
    return { play: p, playInstance: pI }
}

const getMultiplePlaysFromInstances = async (instances) => {
    const plays = []
    for (let play of instances) {
        const currentPlay = await Play.findOne({ playsInstances: play._id }).populate('playsInstances')

        plays.push(currentPlay)
    }

    // console.log(plays)
    return plays
}

const getMultiplePlaysFromWishlist = async (wishlist) => {
    const instances = wishlist.map(item => item.playInstanceId)
    return await getMultiplePlaysFromInstances(instances)
}


// const SortbyTitle = async () => 
//     {
//         let sortedPlays = await Play.find({}).populate("playsInstances").sort({title: 'asc'})
//         console.log(sortedPlays)
//         return {play : sortedPlays}
//      }




module.exports = {
    getAllPlays,
    getOnePlay,

    getFivePlays,

    getMultiplePlaysFromInstances,
    getMultiplePlaysFromWishlist

}