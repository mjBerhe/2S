import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import { useUsers } from '../state/users.js';
import { useCustomRoom } from '../state/customRoom.js';
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
	const { addCustomRoom, updateCustomRooms } = useCustomRoom();
	const { addRoomChat, addNotification } = useChatBox();
	const { resetMatch } = useMatch();
	const { resetDMState } = useDeathMatch();

	const customRooms = useCustomRoom(state => state.rooms);

	const [username, setUsername] = useState({
		name: '',
		id: null,
	});

	// to determine which component to display to the user
	const [currentRoom, setCurrentRoom] = useState('');

	// to determine if inside a custom made room or premade room
	const [customRoom, setCustomRoom] = useState(false);

	// temporary list of available room names
	const [listOfRooms, setListOfRooms] = useState([]);

	// to determine if showing form creation or not
	const [creatingRoom, setCreatingRoom] = useState(false);

	// to determine if showing available rooms to join or not
	const [joiningRoom, setJoiningRoom] = useState({
		actve: false,
		class: 'button-1 lobby-room-button',
	});

	const handleUsername = (e) => {
		e.persist();
		setUsername(prev => ({
			...prev,
			name: e.target.value,
		}));
		if (e.target.value) {
			gamelobbySocket.tempName = e.target.value;
		}
	}

	// setting id when socket changes
	useEffect(() => {
		if (gamelobbySocket.id) {
			setUsername(prev => ({
				...prev,
				id: gamelobbySocket.id
			}));
		}
	}, [gamelobbySocket.id]);

	const handleJoinRoom = (e) => {
		e.preventDefault();
		gamelobbySocket.emit('joinRoom', {
			room: e.target.value,
			username: username,
		});
	}

	const handleLeaveRoom = (e) => {
		e.preventDefault();
		gamelobbySocket.emit('disconnectUser', {
			room: currentRoom,
			name: gamelobbySocket.tempName,
			id: gamelobbySocket.id,
		});
		setCurrentRoom('');
		
		resetMatch();
		resetDMState();
	}

	const toggleCreatingRoom = () => {
		setCreatingRoom(!creatingRoom);
	}

	const toggleJoiningRoom = () => {
		setJoiningRoom(prevState => ({
			...prevState,
			active: !prevState.active,
		}));
	}

	// socket events
	useEffect(() => {
		// welcome message on connection to socket
		gamelobbySocket.on('welcome', data => {
			console.log(data.msg);
			setListOfRooms(data.availableRooms); // sets available rooms that already exist
			updateCustomRooms(data.customRooms); // sets custom rooms info
			updateUsersList(data.usersList); // sets users
		});

		// error joining the room
		gamelobbySocket.on('invalidRoom', data => {
			console.log(data.msg);
		});

		// rooms is full
		gamelobbySocket.on('roomFull', data => {
			console.log(data.msg);
		})

		// when someone joins a room (confirmed through server)
		gamelobbySocket.on('userJoinedRoom', data => {
			// must add logic to check if that user isnt already connected to the room using ids
			setCurrentRoom(data.room);
			addUser(data.room, data.username);

			if (data.customRoom) { // joining a custom made room
				setCustomRoom(true);

				addRoomChat(data.room); // add room in the chat section
				// addNotification(data.msg, data.room); // send notification to the room
				addCustomRoom(data.room, data.hostName, data.hostID, data.maxCapacity); // add custom room
			} else { // joining a premade room
				setCustomRoom(false);
			}
		});

		// when someone leaves a room
		gamelobbySocket.on('userLeftRoom', data => {
			removeUser(data.room, data.id);
			// addNotification(data.msg, data.room);
		});

		// to update all users whenever someone joins/leaves a room
		gamelobbySocket.on('sendUserList', userList => {
			updateUsersList(userList);
		});

		gamelobbySocket.on('addRoom', data => {
			addRoomUsers(data.roomName); // add room to the users section
			setListOfRooms(prevRooms => ([...prevRooms, data.roomName]));

			addCustomRoom(data.roomName, data.hostName, data.hostID, data.maxCapacity);

			// if this is the host of the new room added
			if (data.hostID === gamelobbySocket.id) {
				// automatically join this room after creation
				gamelobbySocket.emit('joinRoom', {
					room: data.roomName,
					username: {
						name: gamelobbySocket.tempName,
						id: gamelobbySocket.id,
					},
				});
				addRoomChat(data.roomName); // add room to the chat section
				setCurrentRoom(data.roomName);
			}
		});

		// to update all users whenever someone joins/leaves a custom room
		gamelobbySocket.on('sendCustomRooms', customRoomsInfo => {
			updateCustomRooms(customRoomsInfo);
		});

		return () => {
			gamelobbySocket.off('welcome');
			gamelobbySocket.off('error');
			gamelobbySocket.off('roomFull');
			gamelobbySocket.off('userJoinedRoom');
			gamelobbySocket.off('userLeftRoom');
			gamelobbySocket.off('sendUserList');
			gamelobbySocket.off('addRoom');
			gamelobbySocket.off('sendCustomRooms');
		}

	}, []);

	// adding rooms (users object) whenever there is a change
	useEffect(() => { 
		listOfRooms.forEach(roomName => {
			if (users[roomName]) {
				// console.log(`users array for ${roomName} already exists`);
			} else {
				addRoomUsers(roomName);
				// console.log(`users array created for ${roomName}`);
			}
		});
	}, [listOfRooms]);

	// changing joiningRoom button class on changes
	useEffect(() => {
		if (joiningRoom.active) {
			setJoiningRoom(prevState => ({
				...prevState,
				class: 'button-1 lobby-room-button2',
			}));
		} else {
			setJoiningRoom(prevState => ({
				...prevState,
				class: 'button-1 lobby-room-button',
			}));
		}
	}, [joiningRoom.active]);

	return (
		<div className="gamelobby-page-container">
			<Head>
				<title>ze game lobby</title>
				<link rel="icon" type="image/png" href="/omega.png" />
				<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet"></link>
			</Head>

			<Header/>
			<QuestionsList/>

			<div className="room-container">
				{!currentRoom && 
					<div className="room-select-container">
						<div className='room-select-title'>
							<h1>2S</h1>
						</div>
						<div className='room-select-interface'>
							<div className='username-container'>
								<input type="text" onChange={handleUsername} value={username.name} placeholder='Enter Your Nickname' autoFocus={true}/>
							</div>
							{!creatingRoom &&
								<div className='available-rooms'>
									<button className={joiningRoom.class} onClick={toggleJoiningRoom}>
										<h5>Join Room</h5>
									</button>
									{!joiningRoom.active &&
										<button className='button-1 lobby-room-button' onClick={toggleCreatingRoom}>
											<h5>Create Room</h5>
										</button>
									}
									{joiningRoom.active && listOfRooms.map(roomName => 
										<button className='button-1 lobby-room-button room-button' onClick={handleJoinRoom} value={roomName} key={roomName}>
											<h5>{roomName}</h5> 
											<h5>{users[roomName] ?
											customRooms[roomName] ? `${users[roomName].length}/${customRooms[roomName].maxCapacity}`
												: `${users[roomName].length}/2`
												: null}
											</h5>
										</button>
									)}
								</div>
							}
							{creatingRoom &&
								<CreateRoom socket={gamelobbySocket} username={username} toggleRoom={toggleCreatingRoom}/>
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
				{/* {currentRoom && 
					<div>
						<h2>Current Users</h2>
						{users[currentRoom].map((user) => <h3 key={user.id}>{user.name}</h3>)}
					</div>
				} */}
			</div>

			<Footer/>

		</div>
	)
}