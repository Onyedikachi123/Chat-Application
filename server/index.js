const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// When a user connect and when a user leaves using "connection/disconnect function"
io.on('connection', (socket) => {
  socket.on('join', ({ name, room}, callback) => {
    // console.log('First occurence r: ', name)
    const { error, user } = addUser({ id: socket.id, name: name, room: room });

    // callback error handling(dont add user if error)
    if(error) return callback(error);

    // welcome message(adding an event with emit)
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`}); // Brocasting to other users that a user has joined

    // Add the user to the room if no error
    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});

    callback();
  });

  // Send message function
  socket.on('sendMessage', ( message, callback ) => {
     const user = getUser(socket.id); // Getting the user that sent message by id

     io.to(user.room).emit('message', { user: user.name, text: message});
     io.to(user.room).emit('roomData', { room: user.room, text: message});

     callback();
  });

  socket.on('disconnect', () => {
      const user = removeUser(socket.id);

      if(user) {
        io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.`})
      }
  })
});

app.use(router);


server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));