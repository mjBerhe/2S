import create from 'zustand';

export const [useUsers] = create((set, get) => ({
	users: {
		'room 1': [],
		'room 2': [],
		'room 3': [],
		'game 1': [],
	},
	addUser: (room, username) => {
		set(prevState => ({
			// if (!prevState.users[data.room].includes(data.username)) {
			users: {
				...prevState.users,
				[room]: [...prevState.users[room], username],
			}
		}))
	},
	removeUser: (room, username) => {
		const users = get().users;
		const index = users[room].findIndex(user => user.id === username.id);
		set(prevState => ({
			users: {
				...prevState.users,
				[room]: prevState.users[room].filter((_, i) => i !== index),
			}
		}))
	},
	updateUsersList: (userList) => {
		set(prevState => ({
			users: userList,
		}))
	}
}))