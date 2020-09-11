import { useState, useEffect } from 'react';
import { useMatch } from '../state/match.js';

export default function Match ({ socket }) {

   const { userTypingAnswer, userSubmitAnswer } = useMatch();

   const questions = useMatch(state => state.questions);
   const userAnswers = useMatch(state => state.userAnswers);
   const currentAnswer = useMatch(state => state.currentAnswer);

   const handleUserAnswer = (e) => {
      e.persist();
      userTypingAnswer(e.target.value);
	}

	const handleSubmitAnswer = (e) => {
      e.preventDefault();
      userSubmitAnswer();
   }
   
   useEffect(() => {
      console.log(userAnswers);
   }, [userAnswers])

   return (
      <div>
         <h2>{questions[userAnswers.length]}</h2>
         <form onSubmit={handleSubmitAnswer}>
            <input className="answer-input" type="text" value={currentAnswer} onChange={handleUserAnswer} autoFocus/>
            <input type="submit" value="Submit"/>
         </form>
      </div>
   );
}