import { useState, useRef, useEffect } from 'react';

export default function ChatBox({ socket, room }) {

	const [message, setMessage] = useState('');
	const [chatBox, setChatBox] = useState([]);
	const [tempName, setTempName] = useState('');

	// constantly fire whenever someone is typing a message
	const handleMessageChange = (e) => {
		setMessage(e.target.value);
	}

	// constantly fire whenever someone is changing their name
	const handleNameChange = (e) => {
		setTempName(e.target.value);
	}

	// when message sent, emits the message through socket
	const handleMessageSubmit = (e) => {
		e.preventDefault();

		socket.emit('msgSent', {
			tempName: tempName,
			message: message,
			room: room,
		})

		// clears after each message is sent
		setMessage('');
	}

	useEffect(() => {
		socket.on('msgSent', data => {
			setChatBox(prevChatBox => ([
				...prevChatBox,
				{
					tempName: data.tempName,
					message: data.message,
				}
			]))
		})
	}, [])


	// for scrolling to the bottom of the chatbox
	const divRef = useRef(null);

	useEffect(() => {
		divRef.current.scrollIntoView({ behaviour: 'smooth' });
	})

	return (
		<div className='chat-container'>
			<h1 className='chat-title'>{room}</h1>
			<div className='chatbox'>
				{chatBox.map((message, index) => <h3 key={index}>{message.tempName}: {message.message}</h3> )}
				<div ref={divRef}></div>
			</div>

			<label>
				Name: <input type="text" value={tempName} onChange={handleNameChange} placeholder="Enter Name"/>
			</label>

			<form onSubmit={handleMessageSubmit}>
				<input type="text" value={message} onChange={handleMessageChange} placeholder='Type a message...'/>
				<input type="submit" value="Submit"/>
			</form>
		</div>
	)
}