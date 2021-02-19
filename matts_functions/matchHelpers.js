// usersArray is filled with objects with a property of id
// username is an object with a property of id
const findUser = (usersArray, username) => {
	const index = usersArray.findIndex(user => user.id === username.id);
	if (index > -1) {
		return true;
	} else return false;
}

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
const removeUser = (usersArray, userID, location) => {
	const index = usersArray.findIndex(user => user.id === userID);

	if (index > -1) { // user was found
		usersArray.splice(index, 1);
		console.log(`${userID} disconnected from the ${location}`);
		return usersArray;
	} else { // user was not found
		console.log(`Error removing ${userID} from the ${location}`);
		return usersArray;
	}
}

// return the queue array after adding the user
const joinQueue = (queueArray, room, username) => {
	queueArray.push(username);
	console.log(`${username.name} has joined the queue in room: ${room}`);
   console.log(queueArray);
   return queueArray;
}

// move all people in queue to users
const prepMatch = (roomsObject, room) => {
	for (let i = 0; i < roomsObject[room].maxCapacity; i++) {
		roomsObject[room].users.push(roomsObject[room].queue.shift());
	}
	// console.log(roomsObject);
}

// resetting room after a game finishes
// const resetRoom = (currentRoom) => {
// 	rooms[currentRoom] = generateRoom.static(10, 2, ['addition1', 'subtraction2', 'multiplication1', 'multiplication2', 'division1', 'bedmas2', 'equations1', 'equations2', 'geometric', 'additive']);
// }

const checkDeathMatch = (deathmatch, elimGap) => {
	// sorts users in ascending order of correct questions
	deathmatch.sort((a, b) => {
		return a.correctQuestions - b.correctQuestions;
	});

	console.log(deathmatch);

	// if last place is behind 2nd last by elimGap, eliminate last place
	if (deathmatch[0].correctQuestions <= deathmatch[1].correctQuestions - elimGap) {
		console.log(`${deathmatch[0].id} has been eliminated`);
		return deathmatch.shift(); // returns eliminated user
	} else return null;
}

exports.findUser = findUser;
exports.addUser = addUser;
exports.removeUser = removeUser;
exports.joinQueue = joinQueue;
exports.prepMatch = prepMatch;
// exports.resetRoom = resetRoom;
exports.checkDeathMatch = checkDeathMatch;