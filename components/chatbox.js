import { useState, useRef, useEffect } from 'react';
import { useChatBox } from '../state/chatBox.js';

export default function ChatBox({ socket, room, username }) {

	const { addMessage } = useChatBox();
	const chatBox = useChatBox(state => state.rooms[room]);

	const [message, setMessage] = useState('');
	// const [chatBox, setChatBox] = useState([]);

	// constantly fire whenever someone is typing a message
	const handleMessageChange = (e) => {
		setMessage(e.target.value);
	}

	// when message sent, emits the message through socket
	const handleMessageSubmit = (e) => {
		e.preventDefault();

		socket.emit('msgSent', {
			username: username,
			message: message,
			room: room,
		})

		// clears after each message is sent
		setMessage('');
	}

	// useEffect(() => {
	// 	// for recieving messages from the server
	// 	socket.on('msgSent', data => {
	// 		setChatBox(prevChatBox => ([
	// 			...prevChatBox,
	// 			{
	// 				username: data.username,
	// 				message: data.message,
	// 			}
	// 		]))
	// 	})

	// }, [])

	useEffect(() => {
		socket.on('msgSent', data => {
			addMessage(data.message, data.username, room);
		});

		return () => {
			socket.off('msgSent');
		}
	}, []);


	// for scrolling to the bottom of the chatbox
	const divRef = useRef(null);

	useEffect(() => {
		divRef.current.scrollIntoView({ behaviour: 'smooth' });
	})

	return (
		<div>
			<div className='chatbox'>
				{chatBox &&
					chatBox.map((message, index) => 
						message.username ? <h3 key={index}>{message.username}: {message.message}</h3>
						: <h3 key={index}>{message.message}</h3> )
				}
				<div ref={divRef}></div>
			</div>

			<form onSubmit={handleMessageSubmit}>
				<input type="text" value={message} onChange={handleMessageChange} placeholder='Type a message...' autoFocus/>
				<button type="submit" value="Submit"/>
			</form>
		</div>
	)
}