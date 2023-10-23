// Node Server which will Handle socket.io conncetions
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

http.listen(8000, function () {
    console.log("Server Started...");
    const users = {};
    io.on('connection', socket => {
        socket.on('new-user-joined', name => {
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
        });

        socket.on('send', message => {
            socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
        });

        socket.on('disconnect', message => {
            socket.broadcast.emit('leave', users[socket.id]);
            delete users[socket.id];
        });
    })
});
