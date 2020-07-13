const socket = io()

let users = []

socket.on('connect', () => {

    const socketId = socket.id

    users[socketId] = {
        id: socketId,
        name: ''
    }

    socket.on('load-messages', (messages) => {
        for (const message of messages) {
            renderMessage(message)
        }

    })

})

socket.on('new-message', (message) => {

    renderMessage(message)

})

socket.on('delete-user', (socketId) => {

    delete users[socketId]

    renderUsers()

})

$('#btSend').click(function() {

    const id = socket.id
    const author = $('#username').val()
    const message = $('#message').val()
    const time = new Date().getHours() + ':' + ("0" + new Date().getMinutes()).slice(-2)

    if (author.length && message.length) {

        const msgObj = {
            id: id,
            author: author,
            message: message,
            time: time
        }

        socket.emit('new-message', msgObj)

        renderMessage(msgObj)

        $('#message').val('')
    }

})

function renderMessage(message) {

    $('.messages').append(`<span>(${message.time}) <strong>${message.author}</strong>: ${message.message}</span><br />`)

    if (!users[message.id]) {
        users[message.id] = {
            id: message.id,
            name: ''
        }
    }
    users[message.id].name = message.author

    renderUsers()

    

}

function renderUsers() {
    $('.users').empty()

    $('.users').append('<strong>Users List</strong><ul>')
    
    for (const userId in users) {
        const user = users[userId]
        $('.users').append(`<li>${user.name ? user.name : user.id}</li>`)
    }

    $('.users').append('</ul>')
}

