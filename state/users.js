import create from 'zustand';

// used to track all users in all rooms
// each property represents a room
// which points to an array of each use in said room

export const [useUsers] = create((set, get) => ({
	users: {

	},
	addRoomUsers: (roomName) => {
		set(prevState => ({
			users: {
				...prevState.users,
				[roomName]: [],
			}
		}));
	},
	addUser: (room, username) => {
		set(prevState => ({
			users: {
				...prevState.users,
				[room]: [...prevState.users[room], username],
			}
		}));
	},
	removeUser: (room, userID) => {
		const users = get().users;
		const index = users[room].findIndex(user => user.id === userID);
		set(prevState => ({
			users: {
				...prevState.users,
				[room]: prevState.users[room].filter((_, i) => i !== index),
			}
		}));
	},
	updateUsersList: (userList) => {
		set(() => ({
			users: userList,
		}));
	}
}));