import { useEffect } from 'react';
import { useMatch } from '../../state/match.js';
import shallow from 'zustand/shallow';

export default function QuestionsList() {

   const { startStatus, roundStatus, completeStatus, currentRound, roundsInfo } = useMatch(state => ({
      startStatus: state.start,
      roundStatus: state.roundStatus,
      completeStatus: state.completed.status,
      currentRound: state.currentRound,
      roundsInfo: state.roundsInfo,
   }), shallow);

   let listOfRounds;

   if (roundsInfo) {
      listOfRounds = Object.keys(roundsInfo);
   }

   return (
      <div className='questions-list-container'>
         {startStatus && !roundStatus.start && roundStatus.showStats &&
            <div className='centered-flex-column'>
               {roundsInfo[`round ${currentRound}`].questionsMaster.map((question, i) =>
                  <div className='rounds-results' key={i}>
                     <h3>Q: {question}</h3>
                     <h3>A: {roundsInfo[`round ${currentRound}`].answers[i]}</h3>
                  </div>
               )}
            </div>
         }
         {completeStatus &&
            <div className='centered-flex-column'>
               {listOfRounds.map((round, i) =>
                  <div key={i}>
                     <h2>{round}</h2>
                     {roundsInfo[round].questionsMaster.map((question, j) => 
                        <div className='rounds-results' key={j}>
                           <h3>Q: {question}</h3>
                           <h3>A: {roundsInfo[round].answers[j]}</h3>
                        </div>
                     )}
                  </div>
               )}
            </div>
         }
      </div>
   );
}

// roundsInfo template
// roundsInfo = {
//    'round 1': {
//       roundType: 'roundTypeExample',
//       questionsMaster: ['question 1', ... 'question n'],
//       questions: [],
//       answers: ['answer 1', ... 'answer n'],
//       results: [],
//    },
//    ...,
//    'round n' : {
//       ...
//    }
// }