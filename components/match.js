import { useState, useEffect } from 'react';
import { useMatch } from '../state/match.js';
import { useNormalRound } from '../state/normalRound.js'; 
import { useDeathMatch } from '../state/deathmatch.js';
import { roundNumber } from '../formulas/roundNumber.js';
import NormalRound from './normalRound.js';
import DeathMatch from './deathmatch.js';
import shallow from 'zustand/shallow';
import useCountdown from '../hooks/useCountdown';

export default function Match({ socket, room, username }) {

	const { startMatch, completeMatch, showRoundStats, incCurrentRound, startRound, startDM } = useMatch();
	const { startStatus, roundStatus, DMStatus, roundLimit, currentRound, roundsInfo, roundStats } = useMatch(state => ({
		startStatus: state.start,
		roundStatus: state.roundStatus,
		DMStatus: state.deathmatchOngoing,
		roundLimit: state.roundAmount,
		currentRound: state.currentRound,
		roundsInfo: state.roundsInfo,
		roundStats: state.roundStats,
	}), shallow);

	const { setRoundInfo, loadQuestion } = useNormalRound();
	const { setDMInfo, loadDMQuestion } = useDeathMatch();

	// countdown is for first round and any subsequent rounds
	const [countdown, startCountdown] = useCountdown(3, () => {
		if (DMStatus) {
			loadDMQuestion();
		} else {
			loadQuestion();
			startRound();
		}
	});

   // after incCurrentRound() is called, set the info for the next round
	useEffect(() => {
		if (currentRound === 1) { // if first round
			startMatch();
			if (!roundsInfo[`round ${currentRound}`].deathmatchRound) { // normal round
				setRoundInfo(roundsInfo[`round ${currentRound}`]);
				startCountdown();
			} else { // deathmatch round
				startDM(socket, room);
				setDMInfo(roundsInfo[`round ${currentRound}`]);
				startCountdown();
			}
		} else if (currentRound > 1) { // subsequent round
			if (!roundsInfo[`round ${currentRound}`].deathmatchRound) { // normal round
				setRoundInfo(roundsInfo[`round ${currentRound}`]);
				startCountdown();
			} else { // deathmatch round
				startDM(socket, room);
				setDMInfo(roundsInfo[`round ${currentRound}`]);
				startCountdown();
			}
      }
	}, [currentRound]);

	useEffect(() => {
		// when all users have completed a round, move to next round
		socket.on('usersRoundComplete', data => {
			console.log(data.msg);
			showRoundStats(data.stats);
		});

		// when all users are ready, start next round
		socket.on('startNextRound', data => {
			console.log(data.msg);
			incCurrentRound();
			setReady(false);
		});

		// when all user have completed final round, complete match
		socket.on('usersFinalRoundComplete', data => {
			console.log(data.msg);
			completeMatch(data.stats);
		});

		return () => {
			socket.off('usersRoundComplete');
			socket.off('startNextRound');
			socket.off('usersFinalRoundComplete');
		}
	}, []);

	const [ready, setReady] = useState(false);

	const handleReadyUp = (e) => {
		e.preventDefault();
		if (!ready) {
			setReady(true);
			socket.emit('readyNextRound', {
				room: room,
				id: username.id,
				name: username.name,
				round: currentRound,
			});
		}
	}

   return (
      <div className='centered-flex-column'>
         {countdown.start && currentRound < roundLimit && currentRound === 1 &&
				<div className='centered-of-parent'>
					<h1>MATCH FOUND</h1>
					{countdown.currentTime > 0 &&
						<h1>Starting Round {currentRound} in: {countdown.currentTime}</h1>
					}
				</div>
			}
         {countdown.start && currentRound <= roundLimit && currentRound > 1 &&
            <div className='centered-of-parent'>
               {countdown.currentTime > 0 &&
                  <h1>Starting Round {currentRound} in: {countdown.currentTime}</h1>
               }
            </div>
         }
			{startStatus && !countdown.start && !roundStatus.start && !roundStatus.showStats && !DMStatus &&
				<div className='centered-of-parent'>
					<h1>Round Completed!</h1>
					<h2>Waiting for other users...</h2>
				</div>
			}
			{startStatus && !roundStatus.start && roundStatus.showStats &&
				<div>
					<h3>Results for Round {currentRound} :</h3>
					{roundStats[`round ${currentRound}`].map((user, i) => 
						<div className='round-results' key={i}>
							<div className='stat-line'><h3>User:&ensp;</h3><h4>{user.name}</h4></div>
							<div className='stat-line'><h3>Total Correct:&ensp;</h3><h4>{user.correctResponses}/{roundsInfo[`round ${currentRound}`].questionsMaster.length}</h4></div>
							{/* <div className='stat-line'><h3>Accuracy:&ensp;</h3><h4>{user.accuracy*100}%</h4></div> */}
							<div className='stat-line'><h3>Average Response Time:&ensp;</h3><h4>{roundNumber(user.avgResponseTime/1000, 2)}s</h4></div>
							{/* <div className='stat-line'><h3>Fastest Correct:&ensp;</h3><h4>{user.fastestCorrectResponse.responseTime}ms on question {user.fastestCorrectResponse.questionNumber}</h4></div>
							<div className='stat-line'><h3>Slowest Correct:&ensp;</h3><h4>{user.slowestCorrectResponse.responseTime}ms on question {user.slowestCorrectResponse.questionNumber}</h4></div> */}
							<div className="stat-line"><h3>Fastest Response Time:&ensp;</h3><h4>{roundNumber(user.fastestResponse.responseTime/1000, 2)}s on question {user.fastestResponse.questionNumber}</h4></div>
							<div className="stat-line"><h3>Slowest Response Time:&ensp;</h3><h4>{roundNumber(user.slowestResponse.responseTime/1000, 2)}s on question {user.slowestResponse.questionNumber}</h4></div>
						</div>
					)}
					<button className='button-1' onClick={handleReadyUp}>
						Ready Up
					</button>
				</div>
			}
			{roundStatus.start && !countdown.start &&
				<NormalRound socket={socket} room={room} username={username}/>
			}
			{DMStatus && !countdown.start && 
				<DeathMatch socket={socket} room={room} username={username}/>
			}
      </div>
   );
}