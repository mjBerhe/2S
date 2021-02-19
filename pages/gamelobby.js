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
		host: false,
	});
	// to determine which component to display to the user
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
				addNotification(data.msg, data.room); // send notification to the room
				addCustomRoom(data.room, data.hostName, data.hostID, data.maxCapacity); // add custom room
			} else { // joining a premade room
				setCustomRoom(false);
			}
		});

		// when someone leaves a room
		gamelobbySocket.on('userLeftRoom', data => {
			removeUser(data.room, data.id);
			addNotification(data.msg, data.room);
		});

		// to update all users whenever someone joins/leaves a room
		gamelobbySocket.on('sendUserList', userList => {
			updateUsersList(userList);
			console.log('recieving updated usersList');
		});

		gamelobbySocket.on('addRoom', data => {
			// console.log(data.msg);

			addRoomUsers(data.roomName); // add room to the users section
			setListOfRooms(prevRooms => ([...prevRooms, data.roomName]));

			addCustomRoom(data.roomName, data.hostName, data.hostID, data.maxCapacity);

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
	}

	const handleLeaveRoom = (e) => {
		e.preventDefault();
		gamelobbySocket.emit('disconnectUser', {
			room: currentRoom,
			name: username.name,
			id: username.id,
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

			<div className="room-container">
				{!currentRoom && 
					<div className="room-select-container">
						<div className='room-select-title'>
							<h1>2S</h1>
						</div>
						<div className='room-select-interface'>
							<div className='username-container'>
								<input type="text" onChange={handleUsername} value={username.name} placeholder='Nickname' autoFocus={true}/>
							</div>
							{!creatingRoom && 
								<div className='available-rooms'>
									<button className='join-room-button' onClick={toggleCreateRoom}>
										Create Room
									</button>
									{listOfRooms.map(roomName => 
										<button className='join-room-button room-button' onClick={handleJoinRoom} value={roomName} key={roomName}>
											<h4>{roomName}</h4> 
											<h4>{users[roomName] ?
											customRooms[roomName] ? `${users[roomName].length}/${customRooms[roomName].maxCapacity}`
												: `${users[roomName].length}/2`
												: null}
											</h4>
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