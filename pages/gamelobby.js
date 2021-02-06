import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import { useUsers } from '../state/users.js';
import { useChatBox } from '../state/chatBox.js';
import { useMatch } from '../state/match.js';
import { useDeathMatch } from '../state/deathmatch.js';

import CreateRoom from '../components/Gameroom/createRoom.js';
import GameRoom from '../components/Gameroom/gameroom.js';
import CustomRoom from '../components/CustomRoom/customRoom.js';
import QuestionsList from '../components/QuestionsList/questionsList.js';
import Header from '../components/Header/header.js';
import Footer from '../components/Footer/footer.js';

// const gamelobby_ENDPOINT = "https://tooslow.herokuapp.com/gamelobby";
// const gamelobby_ENDPOINT = "https://2slow.vercel.app/gamelobby";
const gamelobby_ENDPOINT = "http://localhost:3000/gamelobby";
const gamelobbySocket = io(gamelobby_ENDPOINT);

export default function GameLobby() {

	const { users, addRoomUsers, addUser, removeUser, updateUsersList } = useUsers();
	const { addRoomChat, addNotification } = useChatBox();
	const { resetMatch } = useMatch();
	const { resetDMState } = useDeathMatch();

	const [username, setUsername] = useState({
		name: '',
		id: null,
		host: false,
	});
	const [currentRoom, setCurrentRoom] = useState('');

	const [listOfRooms, setListOfRooms] = useState([]);

	// to determine if showing form creation or not
	const [creatingRoom, setCreatingRoom] = useState(false);

	// to determine if inside a custom made room or premade room
	const [customRoom, setCustomRoom] = useState(false);

	// socket events
	useEffect(() => {
		// welcome message on connection to socket
		gamelobbySocket.on('welcome', data => {
			console.log(data.msg);
			setListOfRooms(data.availableRooms);
		});

		// error message
		gamelobbySocket.on('invalidRoom', msg => {
			console.log(msg);
		});

		// when someone joins a room
		gamelobbySocket.on('userConnected', data => {
			// must add logic to check if that user isnt already connected to the room using ids
			addUser(data.room, data.username);
			if (data.customRoom) { // joining a custom made room
				setCustomRoom(true);
				addRoomChat(data.room); // add room in the chat section
				addNotification(data.msg, data.room);
			} else { // joining a premade room
				setCustomRoom(false);
			}
		});

		// when someone leaves a room
		gamelobbySocket.on('removeUser', data => {
			removeUser(data.room, data.username);
			addNotification(data.msg, data.room);
		});

		// to update all users whenever someone joins/leaves a room
		gamelobbySocket.on('sendUserList', userList => {
			updateUsersList(userList);
		});

		gamelobbySocket.on('addRoom', data => {
			console.log(data.msg);
			addRoomUsers(data.roomName); // add room to the users section
			setListOfRooms(prevRooms => ([...prevRooms, data.roomName]));

			// if this is the host of the new room added
			if (data.hostID === gamelobbySocket.id) {
				// automatically join this room after creation
				gamelobbySocket.emit('joinRoom', {
					room: data.roomName,
					username: {
						name: localStorage.getItem('name'),
						id: gamelobbySocket.id,
					},
				});
				addRoomChat(data.roomName); // add room to the chat section
				setCurrentRoom(data.roomName);
				
				setUsername(prevUsername => ({ // setting user as host
					...prevUsername,
					host: true,
				}));
			}
		});

		return () => {
			gamelobbySocket.off('welcome');
			gamelobbySocket.off('error');
			gamelobbySocket.off('userConnected');
			gamelobbySocket.off('removeUser');
			gamelobbySocket.off('sendUserList');
			gamelobbySocket.off('addRoom');
		}

	}, []);

	useEffect(() => { // adding rooms (users object) whenever there is a change
		listOfRooms.forEach(roomName => {
			if (users[roomName]) {
				// console.log(`users array for ${roomName} already exists`);
			} else {
				addRoomUsers(roomName);
				// console.log(`users array created for ${roomName}`);
			}
		});
	}, [listOfRooms])
	
	const handleUsername = (e) => {
		e.preventDefault();
		setUsername({
			name: e.target.value,
			id: gamelobbySocket.id,
		});
		localStorage.setItem('name', e.target.value);
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
					<div className="room-select-container">
						<div className='room-select-title'>
							<h1>2Slow</h1>
						</div>
						<div className='room-select-interface'>
							<div className='username-container'>
								<input type="text" onChange={handleUsername} value={username.name} placeholder='Nickname'/>
							</div>
							{!creatingRoom && 
								<div className='available-rooms'>
									<button onClick={toggleCreateRoom}>
										Create Room
									</button>
									{listOfRooms.map(roomName => 
										<button onClick={handleJoinRoom} value={roomName} key={roomName}>
											{roomName}
										</button>
									)}
								</div>
							}
							{creatingRoom &&
								<CreateRoom socket={gamelobbySocket} username={username} toggleRoom={toggleCreateRoom}/>
							}
						</div>
					</div>
				}
				{currentRoom && !customRoom &&
					<GameRoom socket={gamelobbySocket} room={currentRoom} username={username} leaveRoom={handleLeaveRoom}/>
				}
				{currentRoom && customRoom &&
					<CustomRoom socket={gamelobbySocket} room={currentRoom} username={username} leaveRoom={handleLeaveRoom}/>
				}
			</div>

			<div className="users-container">
				{currentRoom && 
					<div>
						<h2>Current Users</h2>
						{users[currentRoom].map((user) => <h3 key={user.id}>{user.name}</h3>)}
					</div>
				}
			</div>

			<Footer/>

		</div>
	)
}