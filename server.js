// const express=require('express');
// const app=express();
// const server=require('http').Server(app);

// app.set('view engine','ejs');

// app.use(express.static('public'));// public here is the place for static assets, like styles, if we wish to keep styles in views we must be mentioning 'views'

// app.get('/',(req,res)=>{
//     res.render('room');//room.ejs must be in views folder
// })

// server.listen(3030);

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000)