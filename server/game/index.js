
const router = require('express').Router()
const game = require('./game').game
const fs = require('fs')

const loadGame = () => JSON.parse(fs.readFileSync('server/game/games/game.json'))

const updateGame = cell => {
  const data = loadGame()
  game.grid = data.grid
  game.players = data.players
  game.currentPlayer = data.currentPlayer
  game.round = data.round
  const turn = game.placeShot(cell)
  fs.writeFileSync(`server/game/games/game.json`, JSON.stringify(game))
  return {game, turn}
}

router.get(`/`, (req, res) => res.send(loadGame()))

router.put(`/`, (req, res, next) => res.send(updateGame(req.body)))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

module.exports = router