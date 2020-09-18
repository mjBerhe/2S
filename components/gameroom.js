import { useState, useEffect } from 'react';
import Match from './match.js';
import { useMatch } from '../state/match.js';

export default function GameRoom({ socket, room, username }) {

	const { joinQueue, leaveQueue, prepMatch, startMatch, completeMatch, loadQuestion, setResults, setAverageTime } = useMatch();

	const queueStatus = useMatch(state => state.queue);
	const startStatus = useMatch(state => state.start);
	const completeStatus = useMatch(state => state.completed);
	const currentQuestion = useMatch(state => state.currentQuestion);
	const userAnswers = useMatch(state => state.userAnswers);
	const userResponseTimes = useMatch(state => state.userResponseTimes);
	const results = useMatch(state => state.results);
	const avgTime = useMatch(state => state.userAverageTime);

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

		// ongoing game is occuring
		socket.on('gameOngoing', data => {
			if (data.id === username.id) {
				console.log(data.msg);
			}
		})

		// successfully joined the queue
		socket.on('joinedQueue', data => {
			if (data.id === username.id) {
				joinQueue();
				console.log(data.msg);
			}
		});

		// game is starting
		socket.on('startGame', data => {
			prepMatch(data.players, data.questions);

			setCountdown(prevCountdown => ({
				...prevCountdown,
				start: true,
			}));
		});

		socket.on('finalResults', data => {
			setResults(data);
			setAverageTime();
		});

	}, [])

	// start the countdown when a match is found &
	// start the game when the countdown finishes
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
				loadQuestion();
			}
		}
	}, [countdown]);

	// checking when match has completed
	useEffect(() => {
		if (startStatus && !currentQuestion) {
			completeMatch();
			console.log('completed all questions');

			socket.emit('sendQuestions', {
				username: username,
				room: room,
				userAnswers: userAnswers,
				userResponseTimes: userResponseTimes,
			});
		}
	}, [userAnswers]);

	return (
		<div className='gameroom-container'>
			<h1>{room}</h1>
			{!queueStatus && !startStatus && !countdown.start && !completeStatus &&
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
				<div>
					<Match />
				</div>
			}
			{completeStatus && 
				<div>
					<h1>COMPLETED ALL QUESTIONS</h1>
					<div>
						<h3>Results: </h3> {results.map((player, index) => 
							<h3 key={index}>{player.name}: {player.results.map((answer, i) => 
								<div key={i}>Question {i}: {player.results[i]} - {player.responseTimes[i]}ms</div>
							)}</h3> 
						)}
						<h3>Average: {avgTime}ms</h3>
					</div>
				</div>
			}
		</div>
	)
}