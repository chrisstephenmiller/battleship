module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

      socket.on(`updateOut`, gameId => {
        console.log(`Update from ${socket.id} on Game ${gameId}`)
        socket.broadcast.emit(`updateIn`)
      })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
