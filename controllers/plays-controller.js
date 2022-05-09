const { Play }  = require("../models/play")
const { PlayInstance, PlayInstanceSchema } = require("../models/playInstance")

const getAllPlays = () => {
    return Play.find({}).populate("playsInstances").sort({dateStart: 'asc'}).limit(5)
}

const getOnePlay = async (playId, playInstanceId) => {
    const p = await Play.findById(playId)
    const pI = await PlayInstance.findById(playInstanceId)
    return { play: p, playInstance: pI }
}

/**
 * Give an array of instances to retrieve their parent plays
 * @param {array} instances - array of play instances (according to schema)
 * @param {boolean} [unique] - should the plays be populated only by the given instances? Default: false
 * @returns array of plays
 */
const getMultiplePlaysFromInstances = async (instances, unique = false) => {
    const plays = []
    for (let play of instances) {
        const currentPlay = unique
          ? await Play.findOne({ playsInstances: play._id }).populate({
              path: 'playsInstances',
              match: { _id: play._id },
            })
          : await Play.findOne({ playsInstances: play._id }).populate('playsInstances')

        // if (currentPlay.playsInstances.length > 1) {
        //     for (let pi of currentPlay.playsInstances) {
        //         if (pi._id === play._id) {
        //             return pi
        //         }
        //     }
        // } 
        
        // currentPlay.playsInstances = currentPlay.playsInstances.filter(el => el._id === play._id)
        plays.push(currentPlay)
    }

    return plays
}

const getMultiplePlaysFromWishlist = async (wishlist) => {
    const instances = wishlist.map(item => item.playInstanceId)
    return await getMultiplePlaysFromInstances(instances)
}


const getAllPlayInstances = () => {
  return PlayInstance.find({})
}

/**
 * Retrieve play instances sorted by start date
 * @param {string} order - type of sorting needed (asc, desc, 1, -1...)
 * @param {number} limit - upper limit of fetched instances
 * @returns MongoDB query
 */
const sortPlayInstancesByDate = (order, limit) => {
    return PlayInstance.find({ dateStart: { $gte: new Date()}}).sort({ dateStart: order }).limit(limit)
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
  getMultiplePlaysFromInstances,
  getMultiplePlaysFromWishlist,
  getAllPlayInstances,
  sortPlayInstancesByDate
}