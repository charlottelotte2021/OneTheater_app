const  Play  = require("../models/play").Play
const  PlayInstance = require("../models/playInstance").PlayInstance

const getAllPlays = () => {
    return Play.find({}).populate("playsInstances")
}

const getOnePlay = async (playId, playInstanceId) => {
    const p = await Play.findById(playId)
    const pI = await PlayInstance.findById(playInstanceId)
    // console.log(p, pI)
    return { play: p, playInstance: pI }
}

module.exports = {
    getAllPlays,
    getOnePlay
}