import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import io from 'socket.io-client';
import { useUsers } from '../state/users.js';
import { useMatch } from '../state/match.js';
import { useDeathMatch } from '../state/deathmatch.js';
import GameRoom from '../components/gameroom.js';
import QuestionsList from '../components/questionsList.js';

const gamelobby_ENDPOINT = "https://tooslow.herokuapp.com/gamelobby";
// const gamelobby_ENDPOINT = "https://2slow-git-master.berhe.vercel.app/";
// const gamelobby_ENDPOINT = "http://localhost:3000/gamelobby";
const gamelobby = io(gamelobby_ENDPOINT);

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
		gamelobby.on('welcome', msg => {
			console.log(msg)
		});

		// error message
		gamelobby.on('err', msg => {
			console.log(msg);
		});

		// when someone joins a room
		gamelobby.on('userConnected', data => {
			// add logic to check if that user isnt already connected to the room using ids
			addUser(data.room, data.username);
			console.log(data.message);
		});

		// when someone leaves a room
		gamelobby.on('removeUser', data => {
			removeUser(data.room, data.username);
		});

		// to update all users whenever someone joins/leaves a room
		gamelobby.on('connectedUsers', userList => {
			updateUsersList(userList);
		});

		return () => {
			gamelobby.off('welcome');
			gamelobby.off('err');
			gamelobby.off('userConnected');
			gamelobby.off('removeUser');
			gamelobby.off('connectedUsers');
		}

	}, []);
	
	const handleUsername = (e) => {
		e.preventDefault();
		setUsername({
			name: e.target.value,
			id: gamelobby.id,
		});
	}

	const handleJoinRoom = (e) => {
		e.preventDefault();
		gamelobby.emit('joinRoom', {
			room: e.target.value,
			username: username,
		});
		setCurrentRoom(e.target.value);
	}

	const handleLeaveRoom = (e) => {
		e.preventDefault();
		gamelobby.emit('disconnectUser', {
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
						<button className='button-1' onClick={handleJoinRoom} value={'Testing Room'}>
							Join Testing Room
						</button>
					</div>
				}
				{currentRoom &&
					<div className='room-container'>
						<GameRoom socket={gamelobby} room={currentRoom} username={username}/>
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