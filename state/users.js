import create from 'zustand';

export const [useUsers] = create((set, get) => ({
	users: {
		'Chatroom 1': [],
		'Chatroom 2': [],
		'Chatroom 3': [],
		'Gameroom 1': [],
		'Gameroom 2': [],
	},
	addUser: (room, username) => {
		set(prevState => ({
			users: {
				...prevState.users,
				[room]: [...prevState.users[room], username],
			}
		}));
	},
	removeUser: (room, username) => {
		const users = get().users;
		const index = users[room].findIndex(user => user.id === username.id);
		set(prevState => ({
			users: {
				...prevState.users,
				[room]: prevState.users[room].filter((_, i) => i !== index),
			}
		}));
	},
	updateUsersList: (userList) => {
		set(prevState => ({
			users: userList,
		}));
	}
}));