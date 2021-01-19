import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import { useUsers } from '../state/users.js';
import { useMatch } from '../state/match.js';
import { useDeathMatch } from '../state/deathmatch.js';
import GameRoom from '../components/Gameroom/gameroom.js';
import QuestionsList from '../components/QuestionsList/questionsList.js';
import Header from '../components/Header/header.js';
import Footer from '../components/Footer/footer.js';
import create from 'zustand';

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

	const [creatingRoom, setCreatingRoom] = useState(false);

	const [listOfRooms, setListOfRooms] = useState([
		'Gameroom 1',
		'Gameroom 2',
		'Testing Room 1',
		'Testing Room 2',
		'Testing Room 3'
	]);

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

	const toggleCreateRoom = () => {
		setCreatingRoom(!creatingRoom);
		console.log(creatingRoom);
	}

	return (
		<div className="gamelobby-page-container">
			<Head>
				<title>ze game lobby</title>
				<link rel="icon" type="image/png" href="/omega.png" />
				<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet"></link>
			</Head>

			<Header/>
			<QuestionsList/>

			<div className="center-container">
				{!currentRoom && 
					<div className="room-container">
						<div className='title-container'>
							<h1>2Slow</h1>
						</div>
						<div className='room-select-interface'>
							<input type="text" onChange={handleUsername} value={username.name} placeholder='Nickname'/>
							<button className='button-1' onClick={toggleCreateRoom}>
								Create Room
							</button>
							{!creatingRoom && 
								<div className='available-rooms'>
									{listOfRooms.map(roomName => 
										<button className='button-1' onClick={handleJoinRoom} value={roomName} key={roomName}>
											{roomName}
										</button>
									)}
								</div>
							}
							{creatingRoom &&
								<div className='create-room'>
									Testing
								</div>
							}
						</div>
					</div>
				}
				{currentRoom &&
					<GameRoom socket={gamelobbySocket} room={currentRoom} username={username} leaveRoom={handleLeaveRoom}/>
				}
			</div>

			<div className="users-container">
				{currentRoom && 
					<div>
						<h2>Current users in room:</h2>
						{users[currentRoom].map((user) => <h3 key={user.id}>{user.name}</h3>)}
					</div>
				}
			</div>

			<Footer/>

		</div>
	)
}