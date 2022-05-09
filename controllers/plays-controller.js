const { Play }  = require("../models/play")
const { PlayInstance } = require("../models/playInstance")

const getAllPlays = () => {
    return Play.find().populate('playsInstances')
}

/**
 * 
 * @param {number} limit - number of plays retrieved
 * @param {object} options {sortField, sortOrder} - sort by sortField 
 * @returns array of plays
 */
const getPlays = (limit, options) => {
    const { sortField, sortOrder } = options
    return Play.find({}).populate("playsInstances").sort({[sortField]: sortOrder}).limit(limit)
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
const getMultiplePlaysFromInstances = async (instances, unique = true) => {
    const plays = []
    for (let play of instances) {
        const currentPlay = unique
          ? await Play.findOne({ playsInstances: play._id }).populate({
              path: 'playsInstances',
              match: { _id: play._id },
            })
          : await Play.findOne({ playsInstances: play._id }).populate('playsInstances')

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

const getPlaysSortedByDate = async (limit) => {
  const instances = await sortPlayInstancesByDate('asc', limit)
  const plays = await getMultiplePlaysFromInstances(instances, true)

  return plays
}

const getPlaysSortedByTheater = async (limit) => {
  const instances = await PlayInstance.find().sort({'theater.name': 1}).limit(limit)
  const plays = await getMultiplePlaysFromInstances(instances, true)

  return plays
}

module.exports = {
  getAllPlays,
  getPlays,
  getOnePlay,
  getMultiplePlaysFromInstances,
  getMultiplePlaysFromWishlist,
  getAllPlayInstances,
  sortPlayInstancesByDate,
  getPlaysSortedByDate,
  getPlaysSortedByTheater
}