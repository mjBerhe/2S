import shallow from 'zustand/shallow';
import { roundNumber } from '../../formulas/roundNumber.js';
import { useMatch } from '../../state/match.js';

export default function CompletedStats({ leaveRoom }) {

   const { roundsInfo, complete, stats } = useMatch(state => ({
      roundsInfo: state.roundsInfo,
      complete: state.completed,
      stats: state.completedStats,
   }), shallow);

   const listOfRounds = Object.keys(stats);

   return (
      <div>
         <h2>{`Winner is ${complete.winner.name}`}</h2>
         <h3>Results: </h3> {listOfRounds.map((round, i) => 
            <div key={i}>
               <h3>{round}</h3> {stats[round].map((user, j) => 
                  <div className='round-results' key={j}>
                     <div className='stat-line'><h3>User:&ensp;</h3><h4>{user.name}</h4></div>
                     <div className='stat-line'><h3>Total Correct:&ensp;</h3><h4>{user.correctResponses}/{roundsInfo[round].questionsMaster.length}</h4></div>
                     {/* <div className='stat-line'><h3>Accuracy:&ensp;</h3><h4>{user.accuracy*100}%</h4></div> */}
                     <div className='stat-line'><h3>Average Response Time:&ensp;</h3><h4>{roundNumber(user.avgResponseTime/1000, 2)}s</h4></div>
                     {/* <div className='stat-line'><h3>Fastest Correct:&ensp;</h3><h4>{user.fastestCorrectResponse.responseTime}ms on question {user.fastestCorrectResponse.questionNumber}</h4></div>
                     <div className='stat-line'><h3>Slowest Correct:&ensp;</h3><h4>{user.slowestCorrectResponse.responseTime}ms on question {user.slowestCorrectResponse.questionNumber}</h4></div> */}
                     <div className="stat-line"><h3>Fastest Response Time:&ensp;</h3><h4>{roundNumber(user.fastestResponse.responseTime/1000, 2)}s on question {user.fastestResponse.questionNumber}</h4></div>
                     <div className="stat-line"><h3>Slowest Response Time:&ensp;</h3><h4>{roundNumber(user.slowestResponse.responseTime/1000, 2)}s on question {user.slowestResponse.questionNumber}</h4></div>
                  </div>
               )}
            </div>
         )}
         <button onClick={leaveRoom}>Dip Dip</button>
      </div>
   )
}