const app = require('express')();
const server = require('http').Server(app);
const PORT = process.env.PORT || 3000;

const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const socket = require('socket.io');
const io = socket(server);

const statsGenerator = require('./matts_functions/stats2.js');
const generateRoom = require('./matts_functions/generateRoom.js');
const match =  require('./matts_functions/matchHelpers.js');

const availableRooms = [ // used to identify which rooms actually exist
	'Gameroom 1',
	'Gameroom 2',
	'Testing Room',
];

const users = { // stores users
	'Gameroom 1': [],
	'Gameroom 2': [],
	'Testing Room': [],
};

const rooms = {
	'Gameroom 1': generateRoom.static(2, 5, ['addition1', 'subtraction1', 'division1', 'bedmas1', 'multiplicationDM']),
	'Gameroom 2': generateRoom.static(3, 2, ['addition1', 'multiplication1']),
	'Testing Room': generateRoom.static(2, 2, ['additionTest', 'multiplicationDM']),
}

let currentUser;

nextApp.prepare()
	.then(() => {

		app.get('*', (req, res) => {
			return nextHandler(req, res)
		});

		const gamelobby = io.of('/gamelobby');
		// const chatlobby = io.of('/chatlobby'); need to make new connection socket for chatlobby later

		// initializing socket when a user goes on /gamelobby
		gamelobby.on('connection', socket => {
			console.log('a user has connected to /gamelobby');
			socket.emit('welcome', 'welcome to /gamelobby');

			socket.on('joinRoom', data => {
				// if room and new user is valid, join room
				if (availableRooms.includes(data.room) && data.username.id) {
					socket.join(data.room);
					users[data.room] = match.addUser(users[data.room], data.room, data.username);
					console.log(users[data.room]);

					gamelobby.to(data.room).emit('userConnected', {
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
				gamelobby.to(data.room).emit('msgSent', data);
				console.log(data);
			});

			socket.on('joinQueue', data => {
				// send a message if there is a current game ongoing in room
				if (rooms[data.room].users[0]) {
					gamelobby.to(data.room).emit('gameOngoing', {
						id: data.username.id,
						msg: 'Ongoing game in current room, try again later',
					});
					console.log(`${data.username.name} tried to join the queue, GAME ONGOING`);

				// join queue if queue is not full & no current game running
				} else if (rooms[data.room].queue.length < rooms[data.room].maxCapacity) {
					rooms[data.room].queue = match.joinQueue(rooms[data.room].queue, data.room, data.username);

					gamelobby.to(data.room).emit('joinedQueue', {
						id: data.username.id,
						msg: 'Successfully joined the queue'
					});
					// start room if queue length has reached capacity
					if (rooms[data.room].queue.length === rooms[data.room].maxCapacity) {
						rooms[data.room].start = true;

						if (rooms[data.room].start) {
							match.prepMatch(rooms, data.room);

							gamelobby.to(data.room).emit('prepMatch', {
								players: rooms[data.room].users,
								rounds: rooms[data.room].rounds,
								roundAmount: rooms[data.room].roundAmount,
								// questions: rooms[data.room].questions,
							});
						}
					}
				// send a message saying queue is currently full
				} else {
					gamelobby.to(data.room).emit('queueFull', {
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
							rooms[data.room].queue = match.removeUser(rooms[data.room].queue, data.username, 'queue');
							console.log(rooms[data.room].queue);
						}
					});
				}
			});

			socket.on('userRoundComplete', data => {
				rooms[data.room].rounds[`round ${data.currentRound}`].results.push({
					id: data.id,
					name: data.name,
					userAnswers: data.userAnswers,
					userResponseTimes: data.userResponseTimes,
				});

				// waiting for all users to complete round
				if (rooms[data.room].users.length === rooms[data.room].rounds[`round ${data.currentRound}`].results.length) {
					// checking if that was the final round
					if (rooms[data.room].roundAmount === data.currentRound) {
						gamelobby.to(data.room).emit('usersFinalRoundComplete', {
							stats: statsGenerator(rooms[data.room].rounds),
							msg: 'All users have completed the final round!',
						});
						resetRoom(data.room);
					} else {
						// send stats for corresponding round
						gamelobby.to(data.room).emit('usersRoundComplete', {
							stats: statsGenerator(rooms[data.room].rounds),
							msg: `All users have completed round ${data.currentRound}`,
						});
					}
				}
			});

			socket.on('readyNextRound', data => {
				// want to validate if user is in the actual game
				rooms[data.room].roundQueue.push({
					id: data.id,
					name: data.name,
				});
				console.log(`${data.name} is ready`);
				// if every current user is ready for next round
				if (rooms[data.room].roundQueue.length === rooms[data.room].users.length) {
					gamelobby.to(data.room).emit('startNextRound', {
						msg: 'All players ready for next round',
					});
					// clear the round queue
					rooms[data.room].roundQueue = [];
				}
			});

			socket.on('initiateDM', data => {
				const ids = rooms[data.room].deathmatch.map(user => user.id);
				rooms[data.room].users.forEach(user => {
					if (!ids.includes(user.id)) {
						// initialize every user in the deathmatch
						rooms[data.room].deathmatch.push({
							id: user.id,
							name: user.name,
							correctQuestions: 0,
							userAnswers: [],
							userResponseTimes: [],
						});
					}
				});
			});

			socket.on('dmQuestion', data => {
				// when recieving a question via deathmatch
				const deathmatch = rooms[data.room].deathmatch;
				deathmatch.forEach((user, i) => {
					if (user.id === data.id) {
						deathmatch[i] = {
							id: data.id,
							name: data.name,
							correctQuestions: deathmatch[i].correctQuestions + 1,
							userAnswers: data.userAnswers,
							userResponseTimes: data.userResponseTimes,
						}
					}
				});

				const eliminatedUser = match.checkDeathMatch(deathmatch, 3);
				// if a user was eliminated in deathmatch
				if (eliminatedUser) {
					rooms[data.room].rounds[`round ${data.currentRound}`].results.push({
						id: eliminatedUser.id,
						name: eliminatedUser.name,
						userAnswers: eliminatedUser.userAnswers,
						userResponseTimes: eliminatedUser.userResponseTimes,
					});
					gamelobby.to(data.room).emit('eliminated', {
						id: eliminatedUser.id,
						msg: 'You have been eliminated',
						stats: statsGenerator(rooms[data.room].rounds),
						questionsAnswered: eliminatedUser.userAnswers.length,
						currentRound: data.currentRound,
					});

					// checking if there is one person left (victor)
					if (deathmatch.length === 1) {
						rooms[data.room].rounds[`round ${data.currentRound}`].results.push({
							id: deathmatch[0].id,
							name: deathmatch[0].name,
							userAnswers: deathmatch[0].userAnswers,
							userResponseTimes: deathmatch[0].userResponseTimes,
						});
						gamelobby.to(data.room).emit('victory', {
							id: deathmatch[0].id,
							msg: 'Congratulations! You have won',
							stats: statsGenerator(rooms[data.room].rounds),
							questionsAnswered: deathmatch[0].userAnswers.length,
							currentRound: data.currentRound,
						});
						resetRoom(data.room);
					}
				}
			});


			// kick out user from room when they leave a room via button
			socket.on('disconnectUser', data => {
				socket.leave(data.room);
				users[data.room] = match.removeUser(users[data.room], data.username, 'room');
				console.log(users[data.room]);

				gamelobby.to(data.room).emit('removeUser', {
					username: data.username,
					room: data.room,
				});

				socket.emit('connectedUsers', users);

				if (rooms[data.room]) {
					// checking if disconnecting user was in a queue, and to remove them if true
					rooms[data.room].queue.forEach(user => {
						if (user.id === data.username.id) {
							rooms[data.room].queue = match.removeUser(rooms[data.room].queue, data.username, 'queue');
							console.log(rooms[data.room].queue);
						}
					});
					// checking if disconnecting user was in a room, and to remove them if true
					rooms[data.room].users.forEach(user => {
						if (user.id === data.username.id) {
							rooms[data.room].users = match.removeUser(rooms[data.room].users, data.username, 'game');
							console.log(rooms[data.room].users);
						}
					});
				}
				
			});

			// need to kick out user from rooms if they disconnect from socket in anyway possible
			socket.on('disconnect', () => {
				if (currentUser) {
					socket.leave(currentUser.room);
					users[currentUser.room] = match.removeUser(users[currentUser.room], currentUser.username, 'room');
					console.log(users[currentUser.room]);

					gamelobby.to(currentUser.room).emit('removeUser', {
						username: currentUser.username,
						room: currentUser.room,
					});

					socket.emit('connectedUsers', users);

					if (rooms[currentUser.room]) {
						// checking if disconnecting user was in a queue, and to remove them if true
						rooms[currentUser.room].queue.forEach(user => {
							if (user.id === currentUser.username.id) {
								rooms[currentUser.room].queue = match.removeUser(rooms[currentUser.room].queue, currentUser.username, 'queue');
								console.log(rooms[currentUser.room].queue);
							}
						});
						// checking if disconnecting user was in a room, and to remove them if true
						rooms[currentUser.room].users.forEach(user => {
							if (user.id === currentUser.username.id) {
								rooms[currentUser.room].users = match.removeUser(rooms[currentUser.room].users, currentUser.username, 'game');
								console.log(rooms[currentUser.room].users);
							}
						});
					}
				}
			});
		});

		server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	});

// resetting room after a game finishes
resetRoom = (currentRoom) => {
	rooms[currentRoom] = generateRoom.static(2, 2, ['additionTest', 'multiplicationDM']);
}