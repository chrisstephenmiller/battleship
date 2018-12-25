const router = require('express').Router()
// const Game = require('../db/models/game')

router.get(`/:gameId`, async (req, res, next) => {
  try {
    const gameId = req.game.id
    const game = await Game.findById(gameId)
    res.send(game)
  }
  catch (err) { next(err) }
})


module.exports = router
