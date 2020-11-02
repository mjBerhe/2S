import { useState, useEffect } from 'react';
import { useMatch } from '../state/match.js';

export default function Match({ socket, room, username }) {

   const { userTypingAnswer, userSubmitAnswer, loadQuestion, startMatch, completeMatch, incCurrentRound, setRoundQuestions, finishedRound } = useMatch();

	const startStatus = useMatch(state => state.start);
	const roundStatus = useMatch(state => state.roundOngoing);
   const roundLimit = useMatch(state => state.roundAmount);
   const currentRound = useMatch(state => state.currentRound);

   const currentQuestion = useMatch(state => state.currentQuestion);
	const currentAnswer = useMatch(state => state.currentAnswer);
	const userAnswers = useMatch(state => state.userAnswers);
	const userResponseTimes = useMatch(state => state.userResponseTimes);

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
      userSubmitAnswer();

      loadQuestion();
   }

   // when currentRound changes, update currentRoundQuestions 
	useEffect(() => {
		if (currentRound === 1) {
         startMatch();
         setRoundQuestions(`round ${currentRound}`);
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

   // going to next round when a round has completed
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
	}, []);
   
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
				setCountdown(prevCountdown => ({
					...prevCountdown,
					currentTime: prevCountdown.initialTime,
					start: false,
				}));
				loadQuestion();
			}
		}
	}, [countdown]);

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
			{!roundStatus && startStatus &&
				<div>
					<h1>Round Completed!</h1>
					<h2>Waiting for other users...</h2>
				</div>
			}
         {startStatus && !countdown.start && roundStatus &&
				<div>
					<h2>{currentQuestion}</h2>
               <form onSubmit={handleSubmitAnswer}>
                  <input className="answer-input" type="text" value={currentAnswer} onChange={handleUserAnswer} autoFocus/>
                  <input type="submit" value="Submit"/>
               </form>
				</div>
			}
      </div>
   );
}