const getPlayerId = require('../game').getPlayerId

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on(`playerId`, playerId => {
      getPlayerId(playerId)
    })

    socket.on(`updateOut`, () => {
      console.log(`update`)
      socket.emit(`updateIn`)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
