import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';

let socket;
const ENDPOINT = "https://cors-anywhere.herokuapp.com/http://2slow.vercel.app/" || "http://localhost:3000/";

export default function chatroom() {

	const [message, setMessage] = useState('');
	const [tempName, setTempName] = useState('');
	const [chatBox, setChatBox] = useState([]);

	// for scrolling to the bottom of the chatbox
	const divRef = useRef(null);

	useEffect(() => {
		divRef.current.scrollIntoView({ behaviour: 'smooth' });
	})

	// constantly fire whenever someone is typing a message
	const handleChange = (e) => {
		setMessage(e.target.value);
	}
	// constantly fire whenever someone is changing their name
	const handleNameChange = (e) => {
		setTempName(e.target.value);
	}

	// when message sent, emits the message through socket
	const handleMessageSubmit = (e) => {
		e.preventDefault();

		socket.emit('chat', {
			tempName: tempName,
			message: message,
		})
	}

	// 2 PROBLEMS
	// 1: WENT SENT, NAME MUST ONLY CHANGE WHEN NEW MESSAGES ARE SENT
	// 2: MUST SEND THROUGH SOCKET THE NAME THAT WAS CHOSEN

	useEffect(() => {
		socket = io(ENDPOINT);

		socket.on('connect', () => {
			console.log('connected');
		});

		socket.on('chat', data => {
			setChatBox(prevChatBox => ([
				...prevChatBox,
				{
					tempName: data.tempName,
					message: data.message,
				}
			]))
		})

		// console.log(socket);

	}, [ENDPOINT])

	return (
		<div className="chatroom-container">
			<Head>
				<title>ze chatroom</title>
			</Head>

			<div className='header'>
				<h1>HEADER GOES HERE</h1>
			</div>

			<div className="column1">
				<h1>this is column 1</h1>
			</div>

			<div className="column2">
				<div>
					<h1 className='chat-title'>CHATROOM HERE</h1>
				</div>
				<div className='chatbox'>
					{chatBox.map((message, index) => <h3 key={index}>{message.tempName}: {message.message}</h3> )}
					<div ref={divRef}></div>
				</div>

				<label>
					Name: <input type="text" value={tempName} onChange={handleNameChange} placeholder="Enter Name"/>
				</label>

				<form onSubmit={handleMessageSubmit}>
					<input type="text" value={message} onChange={handleChange}/>
					<input type="submit" value="Submit"/>
				</form>
			</div>

			<div className="column3">
				<h1>this is column 3</h1>
			</div>

			<div className='footer'>
				<h1>FOOTER GOES HERE</h1>
			</div>
		</div>
	)
}