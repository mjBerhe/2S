import { useEffect } from 'react';
import Match from './match.js';
import { useMatch } from '../state/match.js';
import shallow from 'zustand/shallow';

export default function GameRoom({ socket, room, username }) {

	const { joinQueue, leaveQueue, prepMatch, incCurrentRound } = useMatch();
	const { queueStatus, startStatus, complete, currentRound, roundsInfo, stats } = useMatch(state => ({
		queueStatus: state.queue,
		startStatus: state.start,
		complete: state.completed,
		currentRound: state.currentRound,
		roundsInfo: state.roundsInfo,
		stats: state.completedStats,
	}), shallow);

	const listOfRounds = Object.keys(stats);

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

		return () => {
			socket.off('queueFull');
			socket.off('gameOngoing');
			socket.off('joinedQueue');
			socket.off('prepMatch');
		}

	}, []);

	return (
		<div className='gameroom-container'>
			{!startStatus && !complete.status && 
				<h1>{room}</h1>
			}
			{!queueStatus && !startStatus && !complete.status &&
				<div className='centered-of-parent'>
					<button className="button-1" onClick={handleFindGame}>
						Look for Game
					</button>
				</div>
			}
			{queueStatus && !startStatus &&
				<div className='centered-of-parent'>
					<h1>SEARCHING FOR GAME...</h1>
					<button className='button-1' onClick={handleLeaveQueue}>
						Leave Queue
					</button>
				</div>
			}
			{!queueStatus && !complete.status && currentRound > 0 &&
				<Match socket={socket} room={room} username={username}/>
			}
			{complete.status && 
				<div>
					<h2>{complete.msg}</h2>
					<h3>Results: </h3> {listOfRounds.map((round, i) => 
						<div key={i}>
							<h3>{round}</h3> {stats[round].map((user, j) => 
								<div className='round-results' key={j}>
									<div className='stat-line'><h3>User:&ensp;</h3><h4>{user.name}</h4></div>
									<div className='stat-line'><h3>Total Correct:&ensp;</h3><h4>{user.correctResponses}/{roundsInfo[round].questionsMaster.length}</h4></div>
									{/* <div className='stat-line'><h3>Accuracy:&ensp;</h3><h4>{user.accuracy*100}%</h4></div> */}
									<div className='stat-line'><h3>Average Response Time:&ensp;</h3><h4>{user.avgResponseTime}ms</h4></div>
									{/* <div className='stat-line'><h3>Fastest Correct:&ensp;</h3><h4>{user.fastestCorrectResponse.responseTime}ms on question {user.fastestCorrectResponse.questionNumber}</h4></div>
									<div className='stat-line'><h3>Slowest Correct:&ensp;</h3><h4>{user.slowestCorrectResponse.responseTime}ms on question {user.slowestCorrectResponse.questionNumber}</h4></div> */}
									<div className="stat-line"><h3>Fastest Response Time:&ensp;</h3><h4>{user.fastestResponse.responseTime}ms on question {user.fastestResponse.questionNumber}</h4></div>
									<div className="stat-line"><h3>Slowest Response Time:&ensp;</h3><h4>{user.slowestResponse.responseTime}ms on question {user.slowestResponse.questionNumber}</h4></div>
								</div>
							)}
						</div>
					)}
				</div>
			}
		</div>
	)
}