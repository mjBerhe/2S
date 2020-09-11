import { useState, useEffect } from 'react';
import Match from './match.js';
import { useMatch } from '../state/match.js';

export default function GameRoom({ socket, room, username }) {

	const { joinQueue, leaveQueue, prepMatch, startMatch } = useMatch();

	const queueStatus = useMatch(state => state.queue);
	const startStatus = useMatch(state => state.start);

	const [countdown, setCountdown] = useState({
		initialTime: 3,
		currentTime: 3,
		start: false,
	});

	const handleFindGame = () => {
		socket.emit('joinQueue', {
			username: username,
			room: room,
		});
	}

	const handleLeaveQueue = () => {
		leaveQueue();
		socket.emit('leaveQueue', {
			username: username,
			room: room,
		});
	}

	useEffect(() => {
		// current queue is full
		socket.on('queueFull', data => {
			if (data.id === username.id) {
				console.log(data.msg);
			}
		});

		// successfully joined the queue
		socket.on('joinedQueue', data => {
			if (data.id === username.id) {
				joinQueue();
				console.log(data.msg);
			}
		});

		// game is starting
		socket.on('startGame', data => {
			const questions = [];
			const answers = [];

			data.questions.forEach(item => {
				questions.push(item.question);
				answers.push(item.answer);
			});

			prepMatch(data.players, questions, answers);

			setCountdown(prevCountdown => ({
				...prevCountdown,
				start: true,
			}));
		})

	}, [])

	// start the countdown when a match is found & start the game when the countdown finishes
	useEffect(() => {
		if (countdown.start) {
			if (countdown.currentTime > 0) {
				setTimeout(() => {
					setCountdown(prevCountdown => ({
						...prevCountdown,
						currentTime: prevCountdown.currentTime - 1,
						end: false,
					}));
				}, 1000);
			} else if (countdown.currentTime === 0) {
				setCountdown(prevCountdown => ({
					...prevCountdown,
					currentTime: prevCountdown.initialTime,
					start: false,
				}));
				startMatch();
			}
		}
	}, [countdown])

	return (
		<div className='gameroom-container'>
			<h1>{room}</h1>
			{!queueStatus && !startStatus && !countdown.start &&
				<div className='centered-flex-column'>
					<button className="button-1" onClick={handleFindGame}>
						Look for Game
					</button>
				</div>
			}
			{queueStatus && !startStatus &&
				<div className='centered-flex-column'>
					<h1>SEARCHING FOR GAME...</h1>
					<button className='button-1' onClick={handleLeaveQueue}>
						Leave Queue
					</button>
				</div>
			}
			{countdown.start &&
				<div>
					<h1>MATCH FOUND</h1>
					{countdown.currentTime > 0 &&
						<h1>Starting in: {countdown.currentTime}</h1>
					}
				</div>
			}
			{!queueStatus && startStatus && !countdown.start &&
				<div className='centered-flex-column'>
					<Match socket={socket}/>
				</div>
			}
		</div>
	)
}