import express from 'express'
import http from 'http'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

let messages = []

let users = []


// socket is the frontend connected
sockets.on('connection', (socket) => {
    const socketId = socket.id

    users[socketId] = {
        id: socketId,
        name: ''
    }

    console.log(`> Server => new connection: ${users[socketId].id}`)

    // emit only to this socket
    socket.emit('load-messages', messages)

    socket.on('new-message', (message) => {

        users[socketId].name = message.author

        messages.push(message)

        socket.broadcast.emit('new-message', message)

    })

    socket.on('disconnect', () => {

        delete users[socketId]

        if (Object.keys(users).length === 0) {
            console.log('> Server => Reset Chat')
            messages = []
        } else {
            console.log(`> Server => User disconnected: ${socketId}`)
            socket.broadcast.emit('delete-user', socketId)
        }

    })

})

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})