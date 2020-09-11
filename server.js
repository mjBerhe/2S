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

const availableRooms = ['Chatroom 1', 'Chatroom 2', 'Chatroom 3', 'Gameroom 1', 'Gameroom 2'];

const users = {
	'Chatroom 1': [],
	'Chatroom 2': [],
	'Chatroom 3': [],
	'Gameroom 1': [],
	'Gameroom 2': [],
};

const rooms = {
	'Gameroom 1': {
		start: false,
		maxCapacity: 2,
		users: [],
		queue: [],
		questions: [{
			question: '5 x 4',
			answer: 20,
		},
		{
			question: '7 x 12',
			answer: 84,
		}],
	},
	'Gameroom 2': {
		start: false,
		maxCapacity: 3,
		users: [],
		queue: [],
	}
}

let currentUser;

nextApp.prepare()
	.then(() => {

		app.get('*', (req, res) => {
			return nextHandler(req, res)
		});

		const chatroom = io.of('/chatroom');

		chatroom.on('connection', socket => {
			console.log('a user has connected to /chatroom');
			socket.emit('welcome', 'welcome to /chatroom');

			socket.on('joinRoom', data => {
				// if room and new user is valid, join room
				if (availableRooms.includes(data.room) && data.username.id) {
					socket.join(data.room);
					addUser(users, data.room, data.username);

					chatroom.to(data.room).emit('userConnected', {
						message: `${data.username.name} has joined ${data.room}`,
						room: data.room,
						username: data.username,
					})

					socket.emit('connectedUsers', users);

					currentUser = {
						username: {
							name: data.username.name,
							id: data.username.id,
						},
						room: data.room,
					}

				} else {
					socket.emit('err', `Error, no room named ${data.room}`);
				}
			});

			socket.on('msgSent', data => {
				chatroom.to(data.room).emit('msgSent', data);
				console.log(data);
			});

			socket.on('joinQueue', data => {
				// join queue if queue is not full
				if (rooms[data.room].queue.length < rooms[data.room].maxCapacity) {
					joinQueue(rooms, data.room, data.username);

					chatroom.to(data.room).emit('joinedQueue', {
						id: data.username.id,
						msg: 'Successfully joined the queue'
					});
					// start room if queue length has reached capacity
					if (rooms[data.room].queue.length === rooms[data.room].maxCapacity) {
						rooms[data.room].start = true;

						if (rooms[data.room].start) {
							startGame(rooms, data.room);

							chatroom.to(data.room).emit('startGame', {
								players: rooms[data.room].users,
								questions: rooms[data.room].questions,
							})
						}
					}
				} else {
					// send a message saying queue is currently full
					chatroom.to(data.room).emit('queueFull', {
						id: data.username.id,
						msg: 'Queue is currently full, try again later',
					});
					console.log(`${data.username.name} tried to join the queue, QUEUE FULL`)
				}
			});

			socket.on('leaveQueue', data => {
				if (rooms[data.room]) {
					rooms[data.room].queue.forEach(user => {
						if (user.id === data.username.id) {
							leaveQueue(rooms, data.room, data.username);
						}
					});
				}
			});



			// kick out user from room when they leave a room via button
			socket.on('disconnectUser', data => {
				socket.leave(data.room);
				removeUser(users, data.room, data.username);

				chatroom.to(data.room).emit('removeUser', {
					username: data.username,
					room: data.room,
				});

				socket.emit('connectedUsers', users);

				// checking if disconnecting user was in a queue, and to remove them if true
				if (rooms[data.room]) {
					rooms[data.room].queue.forEach(user => {
						if (user.id === data.username.id) {
							leaveQueue(rooms, data.room, data.username);
						}
					});
				}
			})

			// need to kick out user from rooms if they disconnect from socket in anyway possible
			socket.on('disconnect', () => {
				if (currentUser) {
					socket.leave(currentUser.room);
					removeUser(users, currentUser.room, currentUser.username);

					chatroom.to(currentUser.room).emit('removeUser', {
						username: currentUser.username,
						room: currentUser.room,
					});

					socket.emit('connectedUsers', users);

				}
			});

		});

		server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	})

const addUser = (usersObject, room, username) => {
	// need to fix this validation if the user already exists
	if (!usersObject[room].includes(username)) {
		usersObject[room].push(username);
		console.log(`${username.name} has joined ${room}`);
		console.log(usersObject);
	}
}

const removeUser = (usersObject, room, username) => {
	const index = usersObject[room].findIndex(user => user.id === username.id);

	if (index > -1) {
		usersObject[room].splice(index, 1);
		console.log(`${username.name} disconnected from ${room}`);
		console.log(usersObject);
	}
}

const joinQueue = (roomsObject, room, username) => {
	roomsObject[room].queue.push(username);
	console.log(`${username.name} has joined the queue in ${room}`);
	console.log(roomsObject);
}

const leaveQueue = (roomsObject, room, username) => {
	const index = roomsObject[room].queue.findIndex(user => user.id === username.id);

	if (index > -1) {
		roomsObject[room].queue.splice(index, 1);
		console.log(`${username.name} has left the queue in ${room}`);
		console.log(roomsObject);
	}
}

const startGame = (roomsObject, room) => {
	for (let i = 0; i < roomsObject[room].maxCapacity; i++) {
		roomsObject[room].users.push(roomsObject[room].queue.shift());
	}
	console.log(roomsObject);
}