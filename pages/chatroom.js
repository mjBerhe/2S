import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import { useUsers } from '../state/users.js';
import { useMatch } from '../state/match.js';
import ChatBox from '../components/chatbox.js'
import GameRoom from '../components/gameroom.js';

let chatroom;
// const chatroom_ENDPOINT = "https://tooslow.herokuapp.com/chatroom";
// const chatroom_ENDPOINT = "https://2slow-git-master.berhe.vercel.app/";
const chatroom_ENDPOINT = "http://localhost:3000/chatroom";


export default function ChatRoom() {

	const { users, addUser, removeUser, updateUsersList } = useUsers();
	const { resetMatch } = useMatch();

	const [username, setUsername] = useState({
		name: '',
		id: null
	});
	const [currentRoom, setCurrentRoom] = useState('');
	const [gameRoom, setGameRoom] = useState(false);

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
			console.log(data.message);
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

	const handleJoinGameRoom = (e) => {
		e.preventDefault();
		chatroom.emit('joinRoom', {
			room: e.target.value,
			username: username,
		});
		setCurrentRoom(e.target.value);
		setGameRoom(true);
	}

	const handleLeaveRoom = (e) => {
		e.preventDefault();
		chatroom.emit('disconnectUser', {
			room: currentRoom,
			username: username,
		});
		setCurrentRoom('');
	 resetMatch();
	}

	const handleLeaveGameRoom = (e) => {
		e.preventDefault();
		chatroom.emit('disconnectUser', {
			room: currentRoom,
			username: username,
		});
		setCurrentRoom('');
		setGameRoom(false);
	 resetMatch();
	}

	return (
		<div className="chatroom-page-container">
			<Head>
				<title>ze chatroom</title>
				<link rel="icon" type="image/png" href="/omega.png" />
			</Head>

			<div className='header'>
				<img src="/omega.png" alt=""/>
			</div>

			<div className="column1">
			</div>

			<div className="column2">
				{!currentRoom && 
					<div className="room-container">
						<input type="text" onChange={handleUsername} value={username.name} placeholder='Enter name'/>
						<br/>
						<button className='button-1' onClick={handleJoinRoom} value={'Chatroom 1'}>
							Join Chatroom 1
						</button>
						<button className='button-1' onClick={handleJoinRoom} value={'Chatroom 2'}>
							Join Chatroom 2
						</button>
						<button className='button-1' onClick={handleJoinRoom} value={'Chatroom 3'}>
							Join Chatroom 3
						</button>
						<button className='button-1' onClick={handleJoinGameRoom} value={'Gameroom 1'}>
							Join Gameroom 1
						</button>
						<button className='button-1' onClick={handleJoinGameRoom} value={'Gameroom 2'}>
							Join Gameroom 2
						</button>
					</div>
				}
				{currentRoom && !gameRoom &&
					<div className="room-container">
						<ChatBox socket={chatroom} room={currentRoom} username={username.name}/>
						<br/>
						<button className='button-1' onClick={handleLeaveRoom}>
							Leave Room
						</button>
					</div> 
				}
				{currentRoom && gameRoom &&
					<div className='room-container'>
						<GameRoom socket={chatroom} room={currentRoom} username={username}/>
						<br/>
						<button className='button-1' onClick={handleLeaveGameRoom}>
							Leave Room
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