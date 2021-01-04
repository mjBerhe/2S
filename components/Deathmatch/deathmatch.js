import { useEffect, useState } from 'react';
import { useMatch } from '../../state/match.js';
import { useDeathMatch } from '../../state/deathmatch.js';
import shallow from 'zustand/shallow';
import useCountdown from '../../hooks/useCountdown';
import Addition from '../QuestionTemplates/addition';
import Bedmas from '../QuestionTemplates/bedmas';

// deathmatch only renders on final round
export default function DeathMatch({ socket, room, username }) {

   const { userTypingAnswer, userSubmitAnswer, checkAnswer, loadDMQuestion } = useDeathMatch();
   const { questionType, incorrectMethod, currentQuestion, currentAnswer, prevAnswerCorrect, userAnswers, userResponseTimes } = useDeathMatch(state => ({
      questionType: state.questionType,
      incorrectMethod: state.incorrectMethod,
      currentQuestion: state.currentQuestion,
      currentAnswer: state.currentAnswer,
      prevAnswerCorrect: state.prevAnswerCorrect,
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

      if (incorrectMethod === 'repeat') {
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
      } else if (incorrectMethod === 'continue') {
         checkAnswer(questionNumber);
         userSubmitAnswer();
      }
   }
   
   const doNothing = (e) => {
      e.preventDefault();
   }

   useEffect(() => {
      if (incorrectMethod === 'repeat') {
         // if a correct response was made
         if (userAnswers.length === questionNumber) {
            socket.emit('dmQuestion', {
               id: username.id,
               name: username.name,
               room: room,
               currentRound: currentRound,
               answer: currentAnswer,
               prevAnswerCorrect: prevAnswerCorrect,
               userAnswers: userAnswers,
               userResponseTimes: userResponseTimes,
            });

            loadDMQuestion(); // load next question
            setQuestionNumber(n => n + 1); // inc question number
            setAnswerInputClass('answer-correct'); // set input box class
         } else console.log('not updated yet');

      } else if (incorrectMethod === 'continue') {
         if (userAnswers.length === questionNumber) {
            socket.emit('dmQuestion', {
               id: username.id,
               name: username.name,
               room: room,
               currentRound: currentRound,
               answer: currentAnswer,
               prevAnswerCorrect: prevAnswerCorrect,
               userAnswers: userAnswers,
               userResponseTimes: userResponseTimes,
            });
   
            loadDMQuestion(); // load next question
            setQuestionNumber(n => n + 1); // inc question number
         }
      }
   }, [userAnswers])

   return (
      <div className='question-area'>
         <h1>Deathmatch</h1>
         <div>
            {questionType === 1 &&
               <Addition terms={currentQuestion}/>
            }
            {questionType === 5 &&
               <Bedmas terms={currentQuestion}/>
            }
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