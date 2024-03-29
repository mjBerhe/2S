import { useState, useEffect } from 'react';
import { useMatch } from '../../state/match.js';
import { useNormalRound } from '../../state/normalRound.js';
import useCountdown from '../../hooks/useCountdown';
import shallow from 'zustand/shallow';
import Addition from '../QuestionTemplates/addition';
import Subtraction from '../QuestionTemplates/subtraction';
import Multiplication from '../QuestionTemplates/multiplication';
import Division from '../QuestionTemplates/division';
import Bedmas from '../QuestionTemplates/bedmas';

export default function NormalRound({ socket, room, username }) {

   const { userTypingAnswer, userSubmitAnswer, checkAnswer, loadQuestion, resetRoundState } = useNormalRound();
   const { questionType, incorrectMethod, answers, currentQuestion, currentAnswer, userAnswers, userResponseTimes } = useNormalRound(state => ({
      questionType: state.questionType,
      incorrectMethod: state.incorrectMethod,
      answers: state.answers,
      currentQuestion: state.currentQuestion,
      currentAnswer: state.currentAnswer,
      userAnswers: state.userAnswers,
      userResponseTimes: state.userResponseTimes,
   }), shallow);

   const { finishedRound } = useMatch();
   const currentRound = useMatch(state => state.currentRound);

   const [questionNumber, setQuestionNumber] = useState(1);
   const [answerInputClass, setAnswerInputClass] = useState('answer-input');
   const [incorrectResponse, setIncorrectResponse] = useState(false);

   const [countdown, startCountdown] = useCountdown(2, () => {
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
            setAnswerInputClass('answer-input'); // input box animation
            userSubmitAnswer(); // save answer
            loadQuestion(); // load next question
            setQuestionNumber(n => n + 1); // inc question number
         } else {
            // do something when wrong
            setIncorrectResponse(true);
            startCountdown();
            console.log(`Question ${questionNumber} is wrong`);
         }
      } else if (incorrectMethod === 'continue') {
         userSubmitAnswer(); // save answer
         loadQuestion(); // load next question
         setQuestionNumber(n => n + 1);
      }
   }

   const doNothing = (e) => {
      e.preventDefault();
   }

   // after user completes the round, communicate with server
	useEffect(() => {
		if (userAnswers.length === answers.length) {
         socket.emit('userRoundComplete', {
            id: username.id,
            name: username.name,
            room: room,
            currentRound: currentRound,
            userAnswers: userAnswers,
            userResponseTimes: userResponseTimes,
         });
         finishedRound();
         console.log('round finished')
      }
      
      return () => {
         if (!currentQuestion && userAnswers.length > 0) {
            // console.log('normalRound component unmounted');
            resetRoundState();
         }
      }
	}, [userAnswers]);

   return (
      <div className='question-area'>
         <h1>{`Round ${currentRound}`}</h1>
         {incorrectMethod === 'repeat' && 
            <div>
               {questionType.code === 1 && <Addition terms={currentQuestion}/>}
               {questionType.code === 2 && <Subtraction terms={currentQuestion}/>}
               {questionType.code === 3 && <Multiplication terms={currentQuestion}/>}
               {questionType.code === 4 && <Division terms={currentQuestion}/>}
               {questionType.code === 5 && <Bedmas terms={currentQuestion}/>}
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
         }
         {incorrectMethod === 'continue' && 
            <div>
               {questionType.code === 1 && <Addition terms={currentQuestion}/>}
               {questionType.code === 2 && <Subtraction terms={currentQuestion}/>}
               {questionType.code === 3 && <Multiplication terms={currentQuestion}/>}
               {questionType.code === 4 && <Division terms={currentQuestion}/>}
               {questionType.code === 5 && <Bedmas terms={currentQuestion}/>}
               <form onSubmit={handleSubmitAnswer}>
                  <input className={answerInputClass} type="text" value={currentAnswer} onChange={handleUserAnswer} autoFocus/>
                  <input type="submit" value="Submit"/>
               </form>
            </div>
         }
      </div>
   )
}