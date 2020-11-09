import { useEffect, useState } from 'react';
import { useMatch } from '../state/match.js';
import { useDeathMatch } from '../state/deathmatch.js';
import shallow from 'zustand/shallow';
import useCountdown from '../hooks/useCountdown';

// deathmatch only renders on final round
export default function DeathMatch({ socket, room, username }) {

   const { userTypingAnswer, userSubmitAnswer, checkAnswer, loadDMQuestion } = useDeathMatch();
   const { currentQuestion, currentAnswer, currentInitialTime, userAnswers, userResponseTimes } = useDeathMatch(state => ({
      currentQuestion: state.currentQuestion,
      currentAnswer: state.currentAnswer,
      currentInitialTime: state.currentInitialTime,
      userAnswers: state.userAnswers,
      userResponseTimes: state.userResponseTimes,
   }), shallow);
  
   const { sliceFinalRound, completeMatch } = useMatch();
   const currentRound = useMatch(state => state.currentRound);

   const [questionNumber, setQuestionNumber] = useState(1);
   const [answerInputClass, setAnswerInputClass] = useState('answer-input');
   const [incorrectResponse, setIncorrectResponse] = useState(false);

   const [countdown, startCountdown] = useCountdown(3, () => {
      setAnswerInputClass('answer-input');
      setIncorrectResponse(false);
      console.log('complete');
   });

   const handleUserAnswer = (e) => {
      e.persist();
      userTypingAnswer(e.target.value);
	}

	const handleSubmitAnswer = (e) => {
      e.preventDefault();

      if (checkAnswer(questionNumber)) {
         // submit answer if correct
         setAnswerInputClass('answer-input');
         userSubmitAnswer()
      } else {
         // do something when wrong
         setIncorrectResponse(true);
         startCountdown();
         console.log(`Question ${questionNumber} is wrong`);
      }
   }
   
   const doNothing = (e) => {
      e.preventDefault();
   }

   useEffect(() => {
      // if a correct response was made
      if (userAnswers.length === questionNumber) {
         socket.emit('dmQuestion', {
            id: username.id,
            name: username.name,
            room: room,
            currentRound: currentRound,
            answer: currentAnswer,
            questionNumber: questionNumber,
            userAnswers: userAnswers,
            userResponseTimes: userResponseTimes,
            responseTime: Date.now() - currentInitialTime,
         });

         loadDMQuestion(); // load next question
         setQuestionNumber(n => n + 1); // inc question number
         setAnswerInputClass('answer-correct');
      } else console.log('not updated yet');
   }, [userAnswers])

   useEffect(() => {
      socket.on('eliminated', data => {
         if (data.id === username.id) {
            console.log(data.msg);
            sliceFinalRound(data.questionsAnswered + 1, data.currentRound);
            completeMatch(data.stats, data.msg);
         }
      });

      socket.on('victory', data => {
         console.log(data)
         if (data.id === username.id) {
            console.log(data.msg);
            sliceFinalRound(data.questionsAnswered, data.currentRound);
            completeMatch(data.stats, data.msg);
         }
      })

      return () => {
         socket.off('eliminated');
         socket.off('victory');
      }
   }, []);

   return (
      <div className='question-area'>
         <h1>Deathmatch</h1>
         <div>
            <h2>{currentQuestion}</h2>
            {!incorrectResponse &&
               <form onSubmit={handleSubmitAnswer}>
                  <input className={answerInputClass} type="text" value={currentAnswer} onChange={handleUserAnswer} autoFocus/>
                  <input type="submit" value="Submit"/>
               </form>
            }
            {incorrectResponse && 
               <form onSubmit={doNothing}>
                  <input className='answer-incorrect' type="text" value={currentAnswer} onChange={handleUserAnswer} autoFocus/>
                  <input type="submit" value="Submit"/>
               </form>
            }
         </div>
      </div>
   )
}