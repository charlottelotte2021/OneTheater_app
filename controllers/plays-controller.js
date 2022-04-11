const  Play  = require("../models/play").Play
const  PlayInstance = require("../models/playInstance").PlayInstance

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
}