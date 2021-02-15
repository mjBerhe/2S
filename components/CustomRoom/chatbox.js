import { useState, useRef, useEffect } from 'react';
import { useChatBox } from '../../state/chatBox.js';

export default function ChatBox({ socket, room, username }) {

	const { addMessage } = useChatBox();
	const chatBox = useChatBox(state => state.rooms[room]);

	const [message, setMessage] = useState('');

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

		setMessage(''); // clears after each message is sent
	}

	useEffect(() => {
		// recieving messages from the server
		socket.on('msgSent', data => {
			addMessage(data.message, data.username, room);
		});

		return () => {
			socket.off('msgSent');
		}
	}, []);

	const divRef = useRef(null); // for scrolling to the bottom of the chatbox

	useEffect(() => {
		divRef.current.scrollIntoView({ behaviour: 'smooth' });
	})

	return (
		<div className='chatbox-container'>
			<div className='chatbox-outer'>
				<div className='chatbox-inner'>
					{chatBox &&
						chatBox.map((message, index) => 
							message.username ? <h3 key={index}>{message.username}: {message.message}</h3>
							: <h2 key={index}>{message.message}</h2> )
					}
					<div ref={divRef}></div>
				</div>
			</div>

			<form onSubmit={handleMessageSubmit} className='chatbox-form'>
				<input type="text" value={message} onChange={handleMessageChange} placeholder='Type a message...' autoFocus/>
				<button type="submit" value="Submit">Submit</button>
			</form>
		</div>
	)
}