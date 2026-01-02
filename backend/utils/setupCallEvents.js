const setupCallEvents = (socket, io) => {
  socket.on("call-user", ({ from, to, type, offer }) => {
    console.log(`📞 ${from} is calling ${to} (${type})`)
    io.to(getSocketId(to)).emit("incoming-call", {
      from,
      type,
      offer,
    })
  })

  socket.on("answer-call", ({ from, to, answer }) => {
    console.log(`✅ ${from} accepted call from ${to}`)
    io.to(getSocketId(to)).emit("call-accepted", {
      from,
      answer,
    })
  })

  socket.on("reject-call", ({ from, to }) => {
    console.log(`❌ ${from} rejected call from ${to}`)
    io.to(getSocketId(to)).emit("call-rejected", { from })
  })

  socket.on("ice-candidate", ({ from, to, candidate }) => {
    io.to(getSocketId(to)).emit("ice-candidate", { from, candidate })
  })

  socket.on("end-call", ({ from }) => {
    console.log(`🔚 Call ended by ${from}`)
    socket.broadcast.emit("end-call", { from })
  })
}

export default setupCallEvents
