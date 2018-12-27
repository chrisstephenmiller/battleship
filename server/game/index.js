
const router = require('express').Router()

const Game = require('./game')
const game = new Game(15, `chris`, `john`, `lee`)
game.players.forEach(player => game.placeRandomBoats(player))

const fs = require('fs')
fs.writeFileSync(`../game.json`, JSON.stringify(game))

const loadGame = () => JSON.parse(fs.readFileSync('../game.json'))

const updateGame = cell => {
  const data = loadGame()
  game.grid = data.grid
  game.players = data.players
  game.currentPlayer = data.currentPlayer
  game.round = data.round
  const turn = game.placeShot(cell)
  fs.writeFileSync(`../game.json`, JSON.stringify(game))
  return { game, turn }
}

router.get(`/`, (req, res) => res.send(loadGame()))

router.put(`/`, (req, res, next) => {
  console.log(req)
  res.send(updateGame(req.body))
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

module.exports = router