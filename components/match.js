import { useState, useEffect } from 'react';
import { useMatch } from '../state/match.js';

export default function Match() {

   const { userTypingAnswer, userSubmitAnswer, loadQuestion } = useMatch();

   const currentQuestion = useMatch(state => state.currentQuestion);
   const currentAnswer = useMatch(state => state.currentAnswer);


   const handleUserAnswer = (e) => {
      e.persist();
      userTypingAnswer(e.target.value);
	}

	const handleSubmitAnswer = (e) => {
      e.preventDefault();
      userSubmitAnswer();

      loadQuestion();
   }

   return (
      <div className='centered-flex-column'>
         <h2>{currentQuestion}</h2>
         <form onSubmit={handleSubmitAnswer}>
            <input className="answer-input" type="text" value={currentAnswer} onChange={handleUserAnswer} autoFocus/>
            <input type="submit" value="Submit"/>
         </form>
      </div>
   );
}