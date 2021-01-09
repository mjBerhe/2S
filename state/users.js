import create from 'zustand';

export const [useUsers] = create((set, get) => ({
	users: {
		'Gameroom 1': [],
		'Gameroom 2': [],
		'Testing Room 1': [],
		'Testing Room 2': [],
		'Testing Room 3': [],
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
		set(() => ({
			users: userList,
		}));
	}
}));