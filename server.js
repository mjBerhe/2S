const app = require('express')();
const cors = require('cors');
const e = require('express');
const server = require('http').Server(app);
const PORT = process.env.PORT || 3000;

const next = require ('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const socket = require('socket.io');
const io = socket(server);

const availableRooms = ['Chatroom 1', 'Chatroom 2', 'Chatroom 3', 'Gameroom 1', 'Gameroom 2'];

const makeQuestions = require('./testing.js');

// NEED TO MAKE FUNCTION TO CLEAN GAMEROOM (START => FALSE) AND CLEAR RESULTS
// WHENEVER EVERYONE LEAVES?
// BUT THEN PEOPLE CANT START A NEW GAME IF THERE IS STILL ATLEAST 1 USER IN THE ROOM

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
		questions: makeQuestions(),
		results: [],
		// questions: [{
		// 	question: '5 x 4',
		// 	answer: 20,
		// },
		// {
		// 	question: '7 x 12',
		// 	answer: 84,
		// }],
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
					users[data.room] = addUser(users[data.room], data.room, data.username);
					console.log(users[data.room]);

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
				// send a message if there is a current game ongoing in room
				if (rooms[data.room].users[0]) {
					chatroom.to(data.room).emit('gameOngoing', {
						id: data.username.id,
						msg: 'Ongoing game in current room, try again later',
					});
					console.log(`${data.username.name} tried to join the queue, GAME ONGOING`);

				// join queue if queue is not full & no current game running
				} else if (rooms[data.room].queue.length < rooms[data.room].maxCapacity) {
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
							});
						}
					}
				// send a message saying queue is currently full
				} else {
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
							rooms[data.room].queue = removeUser(rooms[data.room].queue, data.username, 'queue');
							console.log(rooms[data.room].queue);
						}
					});
				}
			});

			socket.on('sendQuestions', data => {
				const answerResults = [];
				for (let i = 0; i < rooms[data.room].questions.length; i++) {
					if (data.userAnswers[i] === rooms[data.room].questions[i].answer) {
						answerResults.push(1);
					} else {
						answerResults.push(2);
					}
				}
				rooms[data.room].results.push({
					id: data.username.id,
					name: data.username.name,
					results: answerResults,
					responseTimes: data.userResponseTimes,
				});
				// wait for all the results to come in
				if (rooms[data.room].users.length === rooms[data.room].results.length) {
					chatroom.to(data.room).emit('finalResults', rooms[data.room].results);
					// reset the room
					rooms[data.room] = resetRoom(rooms[data.room]);
				}
			});


			// kick out user from room when they leave a room via button
			socket.on('disconnectUser', data => {
				socket.leave(data.room);
				users[data.room] = removeUser(users[data.room], data.username, 'room');
				console.log(users[data.room]);

				chatroom.to(data.room).emit('removeUser', {
					username: data.username,
					room: data.room,
				});

				socket.emit('connectedUsers', users);

				if (rooms[data.room]) {
					// checking if disconnecting user was in a queue, and to remove them if true
					rooms[data.room].queue.forEach(user => {
						if (user.id === data.username.id) {
							rooms[data.room].queue = removeUser(rooms[data.room].queue, data.username, 'queue');
							console.log(rooms[data.room].queue);
						}
					});
					// checking if disconnecting user was in a room, and to remove them if true
					rooms[data.room].users.forEach(user => {
						if (user.id === data.username.id) {
							rooms[data.room].users = removeUser(rooms[data.room].users, data.username, 'game');
							console.log(rooms[data.room].users);
						}
					});
				}
				
			});

			// need to kick out user from rooms if they disconnect from socket in anyway possible
			socket.on('disconnect', () => {
				if (currentUser) {
					socket.leave(currentUser.room);
					users[currentUser.room] = removeUser(users[currentUser.room], currentUser.username, 'room');
					console.log(users[currentUser.room]);

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


// returns the new userArray after adding the user
const addUser = (userArray, room, username) => {
	// need to fix validation for checking is user already exits in the room
	if (!userArray.includes(username)) {
		userArray.push(username);
		console.log(`${username.name} has joined ${room}`);
		return userArray;
	} else {
		console.log(`${username.name} could not join ${room}`);
		return userArray;
	}
}

// returns the new userArray after removing the user
const removeUser = (usersArray, username, location) => {
	const index = usersArray.findIndex(user => user.id === username.id);

	if (index > -1) {
		usersArray.splice(index, 1);
		console.log(`${username.name} disconnected from the ${location}`);
		return usersArray;
	} else {
		console.log(`Error removing ${username.name} from the ${location}`);
		return usersArray;
	}
}

// covert this to addUser
const joinQueue = (roomsObject, room, username) => {
	roomsObject[room].queue.push(username);
	console.log(`${username.name} has joined the queue in ${room}`);
	console.log(roomsObject);
}

// move all people in queue to users
const startGame = (roomsObject, room) => {
	for (let i = 0; i < roomsObject[room].maxCapacity; i++) {
		roomsObject[room].users.push(roomsObject[room].queue.shift());
	}
	console.log(roomsObject);
}

const resetRoom = (currentRoom) => {
	const cleanRoom = {
		start: false,
		maxCapacity: currentRoom.maxCapacity,
		users: [],
		queue: [],
		questions: makeQuestions(),
		results: [],
	}
	return cleanRoom;
}