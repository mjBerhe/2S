import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import io from 'socket.io-client';
import { useUsers } from '../state/users.js';
import { useMatch } from '../state/match.js';
import { useDeathMatch } from '../state/deathmatch.js';
import GameRoom from '../components/gameroom.js';
import QuestionsList from '../components/questionsList.js';

// const gamelobby_ENDPOINT = "https://tooslow.herokuapp.com/gamelobby";
// const gamelobby_ENDPOINT = "https://2slow.vercel.app/gamelobby";
const gamelobby_ENDPOINT = "http://localhost:3000/gamelobby";
const gamelobbySocket = io(gamelobby_ENDPOINT);

export default function GameLobby() {

	const { users, addUser, removeUser, updateUsersList } = useUsers();
	const { resetMatch } = useMatch();
	const { resetDMState } = useDeathMatch();

	const [username, setUsername] = useState({
		name: '',
		id: null
	});
	const [currentRoom, setCurrentRoom] = useState('');

	// socket events
	useEffect(() => {
		// welcome message on connection to socket
		gamelobbySocket.on('welcome', msg => {
			console.log(msg)
		});

		// error message
		gamelobbySocket.on('invalidRoom', msg => {
			console.log(msg);
		});

		// when someone joins a room
		gamelobbySocket.on('userConnected', data => {
			// add logic to check if that user isnt already connected to the room using ids
			addUser(data.room, data.username);
			console.log(data.msg);
		});

		// when someone leaves a room
		gamelobbySocket.on('removeUser', data => {
			removeUser(data.room, data.username);
			console.log(data.msg);
		});

		// to update all users whenever someone joins/leaves a room
		gamelobbySocket.on('sendUserList', userList => {
			updateUsersList(userList);
		});

		return () => {
			gamelobbySocket.off('welcome');
			gamelobbySocket.off('error');
			gamelobbySocket.off('userConnected');
			gamelobbySocket.off('removeUser');
			gamelobbySocket.off('sendUserList');
		}

	}, []);
	
	const handleUsername = (e) => {
		e.preventDefault();
		setUsername({
			name: e.target.value,
			id: gamelobbySocket.id,
		});
	}

	const handleJoinRoom = (e) => {
		e.preventDefault();
		gamelobbySocket.emit('joinRoom', {
			room: e.target.value,
			username: username,
		});
		setCurrentRoom(e.target.value);
	}

	const handleLeaveRoom = (e) => {
		e.preventDefault();
		gamelobbySocket.emit('disconnectUser', {
			room: currentRoom,
			username: username,
		});
		setCurrentRoom('');
		
		resetMatch();
		resetDMState();
	}

	return (
		<div className="lobby-page-container">
			<Head>
				<title>ze game lobby</title>
				<link rel="icon" type="image/png" href="/omega.png" />
				<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet"></link>
			</Head>

			<div className='header'>
				<div className='header-column1'>
					<Link href='/'><a className='header-link'>Home</a></Link>
				</div>
				<div className='header-img'>
					<img src="/omega.png" alt=""/>
				</div>
			</div>

			<div className="column1">
				<QuestionsList/>
			</div>

			<div className="column2">
				{!currentRoom && 
					<div className="room-container">
						<input type="text" onChange={handleUsername} value={username.name} placeholder='Enter name'/>
						<br/>
						<button className='button-1' onClick={handleJoinRoom} value={'Gameroom 1'}>
							Join Gameroom 1
						</button>
						<button className='button-1' onClick={handleJoinRoom} value={'Gameroom 2'}>
							Join Gameroom 2
						</button>
						<button className='button-1' onClick={handleJoinRoom} value={'Testing Room 1'}>
							Join Testing Room 1
						</button>
						<button className='button-1' onClick={handleJoinRoom} value={'Testing Room 2'}>
							Join Testing Room 2
						</button>
					</div>
				}
				{currentRoom &&
					<div className='room-container'>
						<GameRoom socket={gamelobbySocket} room={currentRoom} username={username}/>
						<br/>
						<button className='button-1' onClick={handleLeaveRoom}>
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