import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import io from 'socket.io-client';
import { useUsers } from '../state/users.js';
import ChatBox from '../components/chatbox.js';

const chatlobby_ENDPOINT = "http://localhost:3000/chatlobby";
const chatlobby = io(chatlobby_ENDPOINT);


export default function ChatLobby() {

   const { users, addUser, removeUser, updateUsersList } = useUsers();

   const [currentRoom, setCurrentRoom] = useState('');
   const [username, setUsername] = useState({
		name: '',
		id: null
   });
   
   const handleUsername = (e) => {
		e.preventDefault();
		setUsername({
			name: e.target.value,
			id: chatlobby.id,
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
	}

   return (
      <div className="lobby-page-container">
			<Head>
				<title>ze chatlobby</title>
				<link rel="icon" type="image/png" href="/omega.png" />
			</Head>

			<div className='header'>
				<Link href='/'><a>Home</a></Link>
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
					</div>
				}
				{currentRoom && 
					<div className="room-container">
						<ChatBox socket={chatlobby} room={currentRoom} username={username.name}/>
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
