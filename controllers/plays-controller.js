const { Play }  = require("../models/play")
const { PlayInstance } = require("../models/playInstance")

const getAllPlays = () => {
    return Play.find({}).populate("playsInstances").limit(10)
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
    
}