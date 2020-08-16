const app = require('express')();
const cors = require('cors');
const server = require('http').Server(app);
const PORT = process.env.PORT || 3000;

const next = require ('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const socket = require('socket.io');
const io = socket(server);

const availableRooms = ['room 1', 'room 2', 'room 3']
const users = {
	'room 1': [],
	'room 2': [],
	'room 3': []
};

nextApp.prepare()
	.then(() => {

		app.get('*', (req, res) => {
			return nextHandler(req, res)
		})

		const chatroom = io.of('/chatroom');

		chatroom.on('connection', socket => {
			console.log('a user has connected to /chatroom');
			socket.emit('welcome', 'welcome to /chatroom');

			socket.on('joinRoom', data => {
				// if room is valid, join room
				if (availableRooms.includes(data.room)) {
					socket.join(data.room);
					console.log(`${data.username.name} has joined ${data.room}`);

					chatroom.to(data.room).emit('userConnected', {
						message: `${data.username.name} has joined ${data.room}`,
						room: data.room,
						username: data.username,
					})

					// if username exists and is not in the users array, add it to users array
					if (data.username.name) {
						if (!users[data.room].includes(data.username)) {
							users[data.room].push(data.username);
						}
					}

					// sends a full user list when anyone joins a room
					socket.emit('connectedUsers', users);
					console.log(users);

				} else {
					socket.emit('err', `Error, no room named ${data.room}`);
				}
			})

			socket.on('msgSent', data => {
				chatroom.to(data.room).emit('msgSent', data);
				console.log(data)
			})

			socket.on('disconnectUser', data => {
				socket.leave(data.room);
				console.log(`${data.username.name} disconnected from ${data.room}`);

				const index = users[data.room].findIndex(user => user.id === data.username.id);

				if (index > -1) {
					users[data.room].splice(index, 1);
					console.log(users);
				}

				chatroom.to(data.room).emit('removeUser', {
					username: data.username,
					room: data.room,
				})

				socket.emit('connectedUsers', users);
			})

		})

		// 	socket.on('disconnect', () => console.log('disconnected from socket'));
		// });

		server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	})



//dev: "next dev"