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

nextApp.prepare()
	.then(() => {

		app.get('*', (req, res) => {
			return nextHandler(req, res)
		})

		const chatroom = io.of('/chatroom');

		chatroom.on('connection', socket => {
			console.log('a user has connected to /chatroom');
			socket.emit('welcome', 'welcome to /chatroom');

			socket.on('joinRoom', room => {
				if (availableRooms.includes(room)) {
					socket.join(room);
					console.log(`a user has joined ${room}`);
					// console.log(socket.rooms)

					chatroom.to(room).emit('userConnected', `A new user has joined ${room}`)

					socket.emit('success', `You have successfully joined ${room}`);

				} else {
					socket.emit('err', `Error, no room named ${room}`);
				}
			})

			socket.on('msgSent', data => {
				chatroom.to(data.room).emit('msgSent', data);
				console.log(data)
			})

			socket.on('disconnectUser', () => {
				const rooms = Object.keys(socket.rooms);
				rooms.forEach(room => {
					if (availableRooms.includes(room)) {
						socket.leave(room);
						console.log(`a user disconnected from ${room}`);
					}
				});
			})

		})





		// io.on("connection", socket => {
		// 	console.log('connection made with socket', socket.id);

		// 	socket.on('chat', data => {
		// 		io.emit('chat', data);
		// 		console.log(data)
		// 	})

		// 	socket.on('disconnect', () => console.log('disconnected from socket'));
		// });

		server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	})



//dev: "next dev"