import { useState, useEffect } from 'react';

export default function GameRoom({ socket, room, username }) {

	const [match, setMatch] = useState({
		queue: false,
		start: false,
		players: [],
		questions: [],
		answers: [],
		currentAnswer: undefined,
		responseTime: [],
	});

	const [countdown, setCountdown] = useState({
		initialTime: 3,
		currentTime: 3,
		start: false,
	});

	const handleFindGame = (e) => {
		socket.emit('joinQueue', {
			username: username,
			room: room,
		});
	}

	const handleLeaveQueue = (e) => {
		setMatch(prevMatch => ({
			...prevMatch,
			queue: false,
		}));
		socket.emit('leaveQueue', {
			username: username,
			room: room,
		});
	}

	const handleAnswerChange = (e) => {
		setMatch(prevMatch => ({
			...prevMatch,
			currentAnswer: e.target.value,
		}))
	}

	const submitAnswer = (e) => {
		e.preventDefault();
		setMatch(prevMatch => ({
			...prevMatch,
			answers: [...prevMatch.answers, prevMatch.currentAnswer],
		}));
		console.log(match.answers);
	}

	useEffect(() => {
		socket.on('queueFull', data => {
			if (data.id === username.id) {
				console.log(data.msg);
			}
		});

		socket.on('joinedQueue', data => {
			if (data.id === username.id) {
				setMatch(prevMatch => ({
					...prevMatch,
					queue: true,
				}));
				console.log(data.msg);
			}
		});

		socket.on('startGame', data => {
			setMatch(prevMatch => ({
				...prevMatch,
				queue: false,
				players: data.players,
				questions: data.questions,
			}));
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
				setMatch(prevMatch => ({
					...prevMatch,
					start: true,
				}));
			}
		}
	}, [countdown])


	return (
		<div className='gameroom-container'>
			<h1>{room}</h1>
			{!match.queue && !match.start && !countdown.start &&
				<div className='centered-flex-column'>
					<button className="button-1" onClick={handleFindGame}>
						Look for Game
					</button>
				</div>
			}
			{match.queue && !match.start &&
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
			{!match.queue && match.start && !countdown.start &&
				<div className='centered-flex-column'>
					<h2>{match.questions}</h2>
					<form onSubmit={submitAnswer}>
						<input className="answer-input" type="number" value={match.currentAnswer} onChange={handleAnswerChange} autoFocus/>
						<input type="submit"/>
					</form>
				</div>
			}
		</div>
	)
}