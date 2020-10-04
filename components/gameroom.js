import { useEffect } from 'react';
import Match from './match.js';
import { useMatch } from '../state/match.js';

export default function GameRoom({ socket, room, username }) {

	const { joinQueue, leaveQueue, prepMatch, incCurrentRound} = useMatch();

	const queueStatus = useMatch(state => state.queue);
	const startStatus = useMatch(state => state.start);
	const completeStatus = useMatch(state => state.completed);

	const currentRound = useMatch(state => state.currentRound);
	const stats = useMatch(state => state.completedStats);

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

	// listening for socket events
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
		socket.on('prepMatch', data => {
			prepMatch(data.players, data.roundAmount, data.rounds);
			incCurrentRound();
		});

	}, [])

	const listOfRounds = Object.keys(stats);

	return (
		<div className='gameroom-container'>
			<h1>{room}</h1>
			{!queueStatus && !startStatus && !completeStatus &&
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
			{!queueStatus && currentRound > 0 &&
				<div>
					<Match socket={socket} room={room} username={username}/>
				</div>
			}
			
			{completeStatus && 
				<div>
					<h2>Game Complete!</h2>
					<div>
						<h3>Results: </h3> {listOfRounds.map((round, i) => 
							<div key={i}>
								<h3>{round}</h3> {stats[round].map((user, j) => 
									<div className='round-results' key={j}>
										<div className='stat-line'><h3>User:&ensp;</h3><h4>{user.name}</h4></div>
										<div className='stat-line'><h3>Total Correct:&ensp;</h3><h4>{user.correctResponses}</h4></div>
										<div className='stat-line'><h3>Accuracy:&ensp;</h3><h4>{user.accuracy*100}%</h4></div>
										<div className='stat-line'><h3>Fastest Correct:&ensp;</h3><h4>{user.fastestCorrectResponse.responseTime}ms on question {user.fastestCorrectResponse.questionNumber}</h4></div>
										<div className='stat-line'><h3>Slowest Correct:&ensp;</h3><h4>{user.slowestCorrectResponse.responseTime}ms on question {user.slowestCorrectResponse.questionNumber}</h4></div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			}
		</div>
	)
}