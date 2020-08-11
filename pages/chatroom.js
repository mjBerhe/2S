import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import ChatBox from '../components/chatbox.js'

let chatroom;
const chatroom_ENDPOINT = "https://tooslow.herokuapp.com/chatroom";
// const chatroom_ENDPOINT = "https://2slow-git-master.berhe.vercel.app/";
// const chatroom_ENDPOINT = "http://localhost:3000/chatroom";

export default function ChatRoom() {

	//const [users, setUsers] = useState([]);
	const [roomSelected, setRoomSelected] = useState(false);
	const [currentRoom, setCurrentRoom] = useState('');

	// testing rooms
	useEffect(() => {
		chatroom = io(chatroom_ENDPOINT);

		chatroom.on('connect', () => {
			//console.log('connected to /chatroom');
		});

		chatroom.on('welcome', msg => {
			console.log(msg)
		});

		chatroom.on('success', msg => {
			console.log(msg);
		});

		chatroom.on('err', msg => {
			console.log(msg);
		});

		chatroom.on('userConnected', msg => {
			console.log(msg)
		})

	}, [chatroom_ENDPOINT])

	const handleJoinRoom = (e) => {
		chatroom.emit('joinRoom', e.target.value);
		setRoomSelected(true);
		setCurrentRoom(e.target.value);
	}

	const handleLeaveRoom = () => {
		chatroom.emit('disconnectUser');
		setRoomSelected(false);
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
				{roomSelected &&
					<div className="room-container">
						<ChatBox socket={chatroom} room={currentRoom}/>
						<br/>
						<button className='join-button' onClick={handleLeaveRoom}>
							Leave Room
						</button>
					</div> 
				}
				{!roomSelected && 
					<div className="room-container">
						<button className='join-button' onClick={handleJoinRoom} value={'room 1'}>
							Join Room 1
						</button>
						<button className='join-button' onClick={handleJoinRoom} value={'room 2'}>
							Join Room 2
						</button>
					</div>
				}
			</div>

			<div className="column3">
			</div>

			<div className='footer'>
				<h1>FOOTER GOES HERE</h1>
			</div>
		</div>
	)
}