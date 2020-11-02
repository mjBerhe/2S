import { useState, useEffect } from 'react';
import { useMatch } from '../state/match.js';
import { useDeathMatch } from '../state/deathmatch.js';
import DeathMatch from './deathmatch.js';
import shallow from 'zustand/shallow';
import useCountdown from '../hooks/useCountdown';

export default function Match({ socket, room, username }) {

	const { userTypingAnswer, userSubmitAnswer, loadQuestion, startMatch, completeMatch, incCurrentRound, setRoundQuestions, finishedRound } = useMatch();
	const { startStatus, roundStatus, roundLimit, currentRound, roundsInfo, currentQuestion, currentAnswer, userAnswers, userResponseTimes } = useMatch(state => ({
		startStatus: state.start,
		roundStatus: state.roundOngoing,
		roundLimit: state.roundAmount,
		currentRound: state.currentRound,
		roundsInfo: state.roundsInfo,
		currentQuestion: state.currentQuestion,
		currentAnswer: state.currentAnswer,
		userAnswers: state.userAnswers,
		userResponseTimes: state.userResponseTimes,
	}), shallow);

	const { startDM, setDMQuestions, loadDMQuestion } = useDeathMatch();
	const DMStatus = useDeathMatch(state => state.start);

   const [countdown, setCountdown] = useState({
		initialTime: 3,
		currentTime: 3,
		start: false,
   });

   const handleUserAnswer = (e) => {
      e.persist();
      userTypingAnswer(e.target.value);
	}

	const handleSubmitAnswer = (e) => {
		e.preventDefault();
		
      userSubmitAnswer(); // save answer
      loadQuestion(); // load next question
   }

   // when currentRound changes, update currentRoundQuestions 
	useEffect(() => {
		if (currentRound === 1) { // first round
         startMatch();
         setRoundQuestions(`round ${currentRound}`);
         setCountdown(prevCountdown => ({
				...prevCountdown,
				start: true,
			}));
		} else if (currentRound > 1 && currentRound === roundLimit) { // deathmatch
			startDM(socket, room);
			setDMQuestions(roundsInfo[`round ${currentRound}`].questions, roundsInfo[`round ${currentRound}`].answers);
         setCountdown(prevCountdown => ({
				...prevCountdown,
				start: true,
			}));
		} else if (currentRound > 1) {
         setRoundQuestions(`round ${currentRound}`);
         setCountdown(prevCountdown => ({
				...prevCountdown,
				start: true,
			}));
      }
	}, [currentRound]);
	
	// start the countdown when a match is found & start the game when the countdown finishes
	useEffect(() => {
		if (countdown.start) {
			if (countdown.currentTime > 0) {
				setTimeout(() => {
					setCountdown(prevCountdown => ({
						...prevCountdown,
						currentTime: prevCountdown.currentTime - 1,
					}));
				}, 1000);
			} else if (countdown.currentTime === 0) {
				if (DMStatus) {
					setCountdown(prevCountdown => ({
						...prevCountdown,
						currentTime: prevCountdown.initialTime,
						start: false,
					}));
					loadDMQuestion();
				} else {
					setCountdown(prevCountdown => ({
						...prevCountdown,
						currentTime: prevCountdown.initialTime,
						start: false,
					}));
					loadQuestion();
				}
			}
		}
	}, [countdown]);

   // after round ends for user, communicate with server
	useEffect(() => {
		if (startStatus && !currentQuestion && currentRound <= roundLimit) {
			finishedRound();
			socket.emit('userRoundComplete', {
				id: username.id,
				name: username.name,
				room: room,
				currentRound: currentRound,
				userAnswers: userAnswers,
				userResponseTimes: userResponseTimes,
			});
		}
	}, [currentQuestion]);

	useEffect(() => {
		// when all users have completed a round, move to next round
		socket.on('usersRoundComplete', data => {
			console.log(data.msg);
			incCurrentRound();
		});

		// when all user have completed final round, complete match
		socket.on('usersFinalRoundComplete', data => {
			console.log(data.msg);
			completeMatch(data.stats);
		});

		return () => {
			socket.off('usersRoundComplete');
			socket.off('usersFinalRoundComplete');
		}
	}, []);

   return (
      <div className='centered-flex-column'>
         {countdown.start && currentRound < roundLimit && currentRound === 1 &&
				<div>
					<h1>MATCH FOUND</h1>
					{countdown.currentTime > 0 &&
						<h1>Starting Round {currentRound} in: {countdown.currentTime}</h1>
					}
				</div>
			}
         {countdown.start && currentRound <= roundLimit && currentRound > 1 &&
            <div>
               {countdown.currentTime > 0 &&
                  <h1>Starting Round {currentRound} in: {countdown.currentTime}</h1>
               }
            </div>
         }
			{startStatus && !roundStatus &&
				<div>
					<h1>Round Completed!</h1>
					<h2>Waiting for other users...</h2>
				</div>
			}
			{roundStatus && !countdown.start && !DMStatus &&
				<div>
					<h1>{`Round ${currentRound}`}</h1>
					<h2>{currentQuestion}</h2>
               <form onSubmit={handleSubmitAnswer}>
                  <input className="answer-input" type="text" value={currentAnswer} onChange={handleUserAnswer} autoFocus/>
                  <input type="submit" value="Submit"/>
               </form>
				</div>
			}
			{roundStatus && !countdown.start && DMStatus &&
				<DeathMatch socket={socket} room={room} username={username}/>
			}
      </div>
   );
}