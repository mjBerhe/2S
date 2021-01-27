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

// const gamelobby_ENDPOINT = "https://tooslow.herokuapp.com/gamelobby";
// const gamelobby_ENDPOINT = "https://2slow.vercel.app/gamelobby";
const gamelobby_ENDPOINT = "http://localhost:3000/gamelobby";
const gamelobbySocket = io(gamelobby_ENDPOINT);

export default function GameLobby() {

	const { users, addRoom, addUser, removeUser, updateUsersList } = useUsers();
	const { resetMatch } = useMatch();
	const { resetDMState } = useDeathMatch();

	const [username, setUsername] = useState({
		name: '',
		id: null
	});
	const [currentRoom, setCurrentRoom] = useState('');

	const [creatingRoom, setCreatingRoom] = useState(false);

	const [listOfRooms, setListOfRooms] = useState([]);

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

		gamelobbySocket.on('addRoom', data => {
			console.log(data.msg);
			addRoom(data.roomName);
			setListOfRooms(prevRooms => ([...prevRooms, data.roomName]));

			if (data.hostID === gamelobbySocket.id) {
				console.log('you are the host sir');
				gamelobbySocket.emit('joinRoom', {
					room: data.roomName,
					username: username,
				});
				setCurrentRoom(data.roomName);
			} else {
				console.log(`you are not the host, hostID: ${data.hostID}, your id: ${username.id}`)
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

	useEffect(() => {
		console.log(username)
	}, [username])

	useEffect(() => {
		listOfRooms.forEach(roomName => {
			if (users[roomName]) {
				// console.log(`users array for ${roomName} already exists`);
			} else {
				addRoom(roomName);
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

	const [formInfo, setFormInfo] = useState({
		roomName: '',
		maxCapacity: 1,
		amountOfRounds: 1,
		incorrectMethod: 'continue',
		dmEliminationGap: 1,
	});

	const handleFormChange = (e) => {
		const formName = e.target.name;
		const formValue = e.target.value;

		setFormInfo(prevForm => ({
			...prevForm,
			[formName]: formValue,
		}));
	}

	const confirmCreateRoom = (e) => {
		e.preventDefault();
		if (formInfo.roomName && formInfo.maxCapacity && formInfo.amountOfRounds && formInfo.dmEliminationGap && formInfo.incorrectMethod) {
			console.log(`form is fully complete: ${formInfo}`);
			gamelobbySocket.emit('createRoom', {
				username: username,
				roomName: formInfo.roomName,
				maxCapacity: formInfo.maxCapacity,
				amountOfRounds: formInfo.amountOfRounds,
				incorrectMethod: formInfo.incorrectMethod,
				dmEliminationGap: formInfo.dmEliminationGap,
			});

			setCreatingRoom(false);
		} else {
			console.log('form is not complete')
		}
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
								<div className='create-room'>
									<form>
										<label className='create-room-name'> 
											Room Name
											<input type="text" name='roomName' value={formInfo.roomName} onChange={handleFormChange} autoComplete='off'/>
										</label>
										<label>
											Max Number of Users
											<select name='maxCapacity' value={formInfo.maxCapacity} onChange={handleFormChange}>
												<option value="1">1</option>
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="4">4</option>
												<option value="5">5</option>
											</select>
										</label>
										<label>
											Number of Rounds
											<select name="amountOfRounds" value={formInfo.amountOfRounds} onChange={handleFormChange}>
												<option value="1">1</option>
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="4">4</option>
												<option value="5">5</option>
												<option value="6">6</option>
												<option value="7">7</option>
												<option value="8">8</option>
												<option value="9">9</option>
												<option value="10">10</option>
											</select>
										</label>
										<label className='incorrect-select'>
											Incorrect Method
											<select name="incorrectMethod" value={formInfo.incorrectMethod} onChange={handleFormChange}>
												<option value="continue">Continue</option>
												<option value="repeat">Repeat</option>
											</select>
										</label>
										<label className='elimination-gap-select'>
											DM Elimination Gap
											<select name="dmEliminationGap" value={formInfo.dmEliminationGap} onChange={handleFormChange}>
												<option value="1">1</option>
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="4">4</option>
												<option value="5">5</option>
											</select>
										</label>
										<div className='create-room-submit'>
											<button type="submit" onClick={confirmCreateRoom}>
												Create Room
											</button>
										</div>
										<div className='create-room-cancel'>
											<button onClick={toggleCreateRoom}>
												Cancel Room
											</button>
										</div>
									</form>
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