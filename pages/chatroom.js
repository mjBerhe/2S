import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import { useUsers } from '../state/users.js';
import ChatBox from '../components/chatbox.js'

let chatroom;
const chatroom_ENDPOINT = "https://tooslow.herokuapp.com/chatroom";
// const chatroom_ENDPOINT = "https://2slow-git-master.berhe.vercel.app/";
// const chatroom_ENDPOINT = "http://localhost:3000/chatroom";



export default function ChatRoom() {

	const { users, addUser, removeUser, updateUsersList } = useUsers();

	const [username, setUsername] = useState({
		name: '',
		id: null
	});

	const [currentRoom, setCurrentRoom] = useState('');

	// testing rooms
	useEffect(() => {
		chatroom = io(chatroom_ENDPOINT);

		// welcome message on connection to socket
		chatroom.on('welcome', msg => {
			console.log(msg)
		});

		// error message
		chatroom.on('err', msg => {
			console.log(msg);
		});

		// when someone joins a room
		chatroom.on('userConnected', data => {
			// add logic to check if that user isnt already connected to the room using ids
			addUser(data.room, data.username);
		});

		// when someone leaves a room
		chatroom.on('removeUser', data => {
			removeUser(data.room, data.username);
		});

		// to update all users whenever someone joins/leaves a room
		chatroom.on('connectedUsers', userList => {
			updateUsersList(userList);
		});

	}, [])

	useEffect(() => {
		console.log(users);
	}, [users])


	const handleUsername = (e) => {
		e.preventDefault();
		setUsername({
			name: e.target.value,
			id: chatroom.id,
		});
	}

	const handleJoinRoom = (e) => {
		e.preventDefault();
		chatroom.emit('joinRoom', {
			room: e.target.value,
			username: username,
		});
		setCurrentRoom(e.target.value);
	}

	const handleLeaveRoom = (e) => {
		e.preventDefault();
		chatroom.emit('disconnectUser', {
			room: currentRoom,
			username: username,
		});
		// setUsers(resetUsers);
		setCurrentRoom('');
	}


	return (
		<div className="chatroom-container">
			<Head>
				<title>ze chatroom</title>
			</Head>

			<div className='header'>
				<h1>HEADER GOES HERE</h1>
			</div>

			<div className="column1">
				<h1>this is h1 text</h1>
				<h2>this is h2 text</h2>
				<h3>this is h3 text</h3>
				<h4>this is h4 text</h4>
			</div>

			<div className="column2">
				{currentRoom &&
					<div className="room-container">
						<ChatBox socket={chatroom} room={currentRoom} username={username.name}/>
						<br/>
						<button className='join-button' onClick={handleLeaveRoom}>
							Leave Room
						</button>
					</div> 
				}
				{!currentRoom && 
					<div className="room-container">
						<input type="text" onChange={handleUsername} value={username.name} placeholder='Enter name'/>
						<button className='join-button' onClick={handleJoinRoom} value={'room 1'}>
							Join Room 1
						</button>
						<button className='join-button' onClick={handleJoinRoom} value={'room 2'}>
							Join Room 2
						</button>
						<button className='join-button' onClick={handleJoinRoom} value={'room 3'}>
							Join Room 3
						</button>
					</div>
				}
			</div>

			<div className="column3">
				<h2>Current users in room:</h2>
				{currentRoom && 
					<div>
						{users[currentRoom].map((user) => <h3 key={user.id}>{user.name}</h3>)}
					</div>
				}
			</div>

			<div className='footer'>
				<h1>FOOTER GOES HERE</h1>
			</div>
		</div>
	)
}