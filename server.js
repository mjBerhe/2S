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
	'Testing Room 1',
	'Testing Room 2',
];

const users = { // stores users
	'Testing Room 1': [],
	'Testing Room 2': [],
};

const rooms = { // available rooms
	'Testing Room 1': generateRoom.randomStandard({
		maxCapacity: 2,
		roundAmount: 2,
		eliminationGap: 2,
		incorrectMethod: 'repeat',
		customRoom: false,
	}),
	'Testing Room 2': generateRoom.randomDeathmatch({
		maxCapacity: 2,
		roundAmount: 3,
		eliminationGap: 3,
		incorrectMethod: 'continue',
		customRoom: false,
	}),
}

const customRoomsInfo = {
	// where custom rooms are added
}

nextApp.prepare().then(() => {

	app.get('*', (req, res) => {
		return nextHandler(req, res);
	});

	const gamelobby = io.of('/gamelobby'); 

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// use gamelobby when talking to everyone on /gamelobby
	// use gamelobby.to(roomName) when talking to a specific roomName
	// use socket when talking to this specific connection 
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

	// initializing socket when a user goes on /gamelobby
	gamelobby.on('connection', socket => {
		console.log('a user has connected to /gamelobby');

		socket.emit('welcome', {
			msg: 'welcome to /gamelobby',
			availableRooms: availableRooms,
			customRooms: customRoomsInfo,
			usersList: users,
		});

		socket.on('createRoom', data => {
			socket.tempName = data.username.name;
			
			// creating new room
			rooms[data.roomName.toString()] = generateRoom.randomStandard({
				maxCapacity: parseInt(data.maxCapacity, 10),
				roundAmount: parseInt(data.amountOfRounds, 10),
				eliminationGap: parseInt(data.dmEliminationGap, 10),
				incorrectMethod: data.incorrectMethod,
				customRoom: true,
			});

			// adding custom room info
			customRoomsInfo[data.roomName] = {
				roomName: data.roomName,
				maxCapacity: data.maxCapacity,
				hostID: data.username.id,
				hostName: data.username.name,
			}

			availableRooms.push(data.roomName);
			users[data.roomName] = [];

			gamelobby.emit('addRoom', {
				customRoom: true,
				roomName: data.roomName,
				hostName: data.username.name,
				hostID: data.username.id,
				maxCapacity: data.maxCapacity,
				msg: `${data.roomName} has been created`,
			});

			gamelobby.emit('sendCustomRooms', customRoomsInfo);
		});

		socket.on('joinRoom', data => {
			// checking if room and user is valid
			if (availableRooms.includes(data.room) && data.username.id) {
				socket.tempName = data.username.name;

				// checking if current room is full
				if (users[data.room].length >= rooms[data.room].maxCapacity) {
					console.log(`${socket.tempName} could not join ${data.room} (FULL)`)
					socket.emit('roomFull', {
						id: data.username.id,
						room: data.room,
						msg: `${socket.tempName} could not join ${data.room} (FULL)`,
					});
				// there is available space in the room
				} else {
					socket.join(data.room, (err) => {
						if (err) {
							console.log(`ERROR: socket couldn't join ${data.room}`);
							socket.emit('invalidRoom', {
								id: data.username.id,
								room: data.room,
								msg: `ERROR: socket couldn't join ${data.room}`,
							});
						} else { // successfully joined the room
							users[data.room] = match.addUser(users[data.room], data.room, data.username);
							console.log(users[data.room]);
	
							// checking if joining a custom room
							if (rooms[data.room].customRoom) {
								// sending confirmation that the user has successfully joined
								gamelobby.to(data.room).emit('userJoinedRoom', {
									msg: `${socket.tempName} has joined the room`,
									room: data.room,
									id: data.username.id,
									username: data.username,
									hostName: customRoomsInfo[data.room].hostName,
									hostID: customRoomsInfo[data.room].hostID,
									maxCapacity: customRoomsInfo[data.room].maxCapacity,
									customRoom: rooms[data.room].customRoom || true,
								});

								// sending info on who is currently ready/unready
								gamelobby.to(data.room).emit('customRoomUsers', {
									room: data.room,
									usersReady: rooms[data.room].queue,
								});
							} else { // joining a premade room
								gamelobby.to(data.room).emit('userJoinedRoom', {
									msg: `${socket.tempName} has joined the room`,
									room: data.room,
									id: data.username.id,
									username: data.username,
									customRoom: rooms[data.room].customRoom || false,
								});
							}
	
							// sending updated list of all users
							gamelobby.emit('sendUserList', users);
						}
					});
				}
			} else {
				console.log("ERROR: room isn't available OR invalid nickname");
				socket.emit('invalidRoom', {
					id: data.username.id,
					room: data.room,
					msg: "ERROR: room isn't available OR invalid nickname",
				});
			}
		});

		socket.on('msgSent', data => {
			gamelobby.to(data.room).emit('msgSent', data);
			console.log(data);
		});

		socket.on('readyCustomMatch', data => {
			// if there is already a game ongoing 
			if (rooms[data.room].users.length > 0) {
				gamelobby.to(data.room).emit('gameOngoing', {
					username: data.username,
					msg: 'Ongoing game in current room, try again later',
				});
			// there is space available in the queue
			} else if (rooms[data.room].queue.length < rooms[data.room].maxCapacity) {
				// user is already ready (this is incase something goes wrong)
				if (match.findUser(rooms[data.room].queue, data.username)) {
					console.log(`${data.username.name} is already ready`);
				} else { // user is now ready
					// maybe add async await here??
					rooms[data.room].queue = match.joinQueue(rooms[data.room].queue, data.room, data.username);
					gamelobby.to(data.room).emit('confirmReady', {
						username: data.username,
						room: data.room,
						msg: `${data.username.name} is ready`
					});
					// sending info on who is currently ready/unready
					gamelobby.to(data.room).emit('customRoomUsers', {
						room: data.room,
						usersReady: rooms[data.room].queue,
					});
				}
			} else console.log('there must be a glitch');
		});

		socket.on('unreadyCustomMatch', data => {
			// if there is already a game ongoing
			if (rooms[data.room].users.length > 0) {
				gamelobby.to(data.room).emit('gameOngoing', {
					username: data.username,
					msg: 'Ongoing game in current room, try again later',
				});
			} else {
				// if user is now NOT ready
				if (match.findUser(rooms[data.room].queue, data.username)) {
					// maybe add async/await here??
					rooms[data.room].queue = match.removeUser(rooms[data.room].queue, data.username.id, 'queue');
					gamelobby.to(data.room).emit('confirmUnready', {
						username: data.username,
						room: data.room,
						msg: `${data.username.name} is not ready`,
					});
					// sending info on who is currently ready/unready
					gamelobby.to(data.room).emit('customRoomUsers', {
						room: data.room,
						usersReady: rooms[data.room].queue,
					});
				} else console.log(`${data.username.name} is already unready`);
			}
		});

		socket.on('startCustomMatch', data => {
			// checking if people ready meet the constraints of the room (not over max, and over 1)
			if (rooms[data.room].queue.length <= rooms[data.room].maxCapacity && rooms[data.room].queue.length > 1) {
				// start the match
				rooms[data.room].start = true;
				match.prepMatch(rooms, data.room);

				gamelobby.to(data.room).emit('prepMatch', {
					players: rooms[data.room].users,
					rounds: rooms[data.room].rounds,
					roundAmount: rooms[data.room].roundAmount,
				});
			} else if (rooms[data.room].queue.length > rooms[data.room].maxCapacity) {
				console.log('Error, player count exceeds room limit');
			} else if (rooms[data.room].queue.length < 2) {
				console.log('Error, not enough players to start match');
			} else {
				console.log('Error, there must be a glitch');
			}
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

					match.prepMatch(rooms, data.room);

					gamelobby.to(data.room).emit('prepMatch', {
						players: rooms[data.room].users,
						rounds: rooms[data.room].rounds,
						roundAmount: rooms[data.room].roundAmount,
					});
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
						rooms[data.room].queue = match.removeUser(rooms[data.room].queue, data.username.id, 'queue');
						console.log(rooms[data.room].queue);
					}
				});
			}
		});

		socket.on('userRoundComplete', data => {
			// recieving results from a user that completed a round
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
			const deathmatch = rooms[data.room].rounds[`round ${data.currentRound}`].deathmatch;
			const ids = deathmatch.map(user => user.id);
			rooms[data.room].users.forEach(user => {
				if (!ids.includes(user.id)) {
					// initialize every user in the deathmatch
					deathmatch.push({
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
			const deathmatch = rooms[data.room].rounds[`round ${data.currentRound}`].deathmatch;
			const results = rooms[data.room].rounds[`round ${data.currentRound}`].results;
			const elimGap = rooms[data.room].rounds[`round ${data.currentRound}`].eliminationGap;

			// when recieving a question via deathmatch, record it
			deathmatch.forEach((user, i) => { // finds user by data.id
				if (user.id === data.id) {
					if (data.prevAnswerCorrect) { // if question was correct
						deathmatch[i] = {
							id: data.id,
							name: data.name,
							correctQuestions: deathmatch[i].correctQuestions + 1,
							userAnswers: data.userAnswers,
							userResponseTimes: data.userResponseTimes,
						}
					} else { // else question was wrong
						deathmatch[i] = {
							id: data.id,
							name: data.name,
							correctQuestions: deathmatch[i].correctQuestions,
							userAnswers: data.userAnswers,
							userResponseTimes: data.userResponseTimes,
						}
					}
				}
			});

			const eliminatedUser = match.checkDeathMatch(deathmatch, elimGap);
			// if a user was eliminated in deathmatch
			if (eliminatedUser) {
				// recording eliminated users results
				results.push({
					id: eliminatedUser.id,
					name: eliminatedUser.name,
					userAnswers: eliminatedUser.userAnswers,
					userResponseTimes: eliminatedUser.userResponseTimes,
				});
				gamelobby.to(data.room).emit('usersDMEliminated', {
					id: eliminatedUser.id,
					msg: 'You have been eliminated',
					stats: statsGenerator(rooms[data.room].rounds),
					questionsAnswered: eliminatedUser.userAnswers.length,
					currentRound: data.currentRound,
				});

				// checking if there is one person left (victor)
				if (deathmatch.length === 1) {
					results.push({
						id: deathmatch[0].id,
						name: deathmatch[0].name,
						userAnswers: deathmatch[0].userAnswers,
						userResponseTimes: deathmatch[0].userResponseTimes,
					});
					gamelobby.to(data.room).emit('usersDMComplete', {
						id: deathmatch[0].id,
						name: deathmatch[0].name,
						stats: statsGenerator(rooms[data.room].rounds),
						questionsAnswered: deathmatch[0].userAnswers.length,
						currentRound: data.currentRound,
					});
					// if this was the final round, end the game
					if (rooms[data.room].roundAmount === data.currentRound) {
						resetRoom(data.room);
					}
				}
			}
		});


		// kick out user from room when they leave a room via button
		socket.on('disconnectUser', data => {
			socket.leave(data.room, (err) => {
				if (err) {
					console.log(`ERROR: socket did not disconnect from ${data.room} properly`);
				} else {
					// removing user from server side
					users[data.room] = match.removeUser(users[data.room], data.id, 'room');
					console.log(users[data.room]);

					// sending updated users list
					gamelobby.emit('sendUserList', users);

					// telling client to remove the user from the room
					gamelobby.to(data.room).emit('userLeftRoom', {
						msg: `${data.name} has left the room`,
						id: data.id,
						name: data.name,
						room: data.room,
					});

					if (rooms[data.room]) {
						// checking if disconnecting user was in a queue, and to remove them if true
						rooms[data.room].queue.forEach(user => {
							if (user.id === data.id) {
								rooms[data.room].queue = match.removeUser(rooms[data.room].queue, data.id, 'queue');
								console.log(rooms[data.room].queue);
							}
						});
						// checking if disconnecting user was in a game, and to remove them if true
						rooms[data.room].users.forEach(user => {
							if (user.id === data.id) {
								rooms[data.room].users = match.removeUser(rooms[data.room].users, data.id, 'game');
								console.log(rooms[data.room].users);
							}
						});
					}
				}
			});	
		});
		
		// fired BEFORE the client disconnects, but hasnt left its rooms yet
		socket.on('disconnecting', (reason) => {
			const listOfClientRooms = Object.keys(socket.rooms);

			listOfClientRooms.forEach(room => {
				if (availableRooms.includes(room)) {
					// removing user from server side
					users[room] = match.removeUser(users[room], socket.id, 'room');
					console.log(users[room]);

					// sending updated users list
					gamelobby.emit('sendUserList', users);

					// telling client to remove the user from the room
					gamelobby.to(room).emit('userLeftRoom', {
						msg: `${socket.tempName} has left the room`,
						id: socket.id,
						name: socket.tempName,
						room: room,
					});

					if (rooms[room]) {
						// checking if disconnecting user was in a queue, and to remove them if true
						rooms[room].queue.forEach(user => {
							if (user.id === socket.id) {
								rooms[room].queue = match.removeUser(rooms[room].queue, socket.id, 'queue');
								console.log(rooms[room].queue);
							}
						});
						// checking if disconnecting user was in a game, and to remove them if true
						rooms[room].users.forEach(user => {
							if (user.id === socket.id) {
								rooms[room].users = match.removeUser(rooms[room].users, socket.id, 'game');
								console.log(rooms[room].users);
							}
						});
					}
				}
			})
		});

		// fires AFTER the client leaves all rooms
		socket.on('disconnect', (reason) => {
			// may want to add some cleanup here when user disconnects
		});
	});

	server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});

// resetting room after a game finishes
resetRoom = (currentRoom) => {
	rooms[currentRoom] = generateRoom.randomStandard(2, 5);
}