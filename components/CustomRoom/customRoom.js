import { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import { roundNumber } from '../../formulas/roundNumber.js';
import ChatBox from './chatbox.js';
import Match from '../Match/match.js';
import { useChatBox } from '../../state/chatBox.js';
import { useMatch } from '../../state/match.js';


export default function CustomRoom({ socket, room, username, handleLeaveRoom }) {

   const { addNotification } = useChatBox();
   const { prepMatch, incCurrentRound } = useMatch();
   const { currentRound, roundsInfo, complete, stats } = useMatch(state => ({
      currentRound: state.currentRound,
      roundsInfo: state.roundsInfo,
      complete: state.completed,
      stats: state.completedStats,
   }), shallow);

   const listOfRounds = Object.keys(stats);

   const [isReady, setIsReady] = useState(false);
   const [buttonClass, setButtonClass] = useState('button-unready');

   const handleStartGame = () => {
      if (username.host) {
         socket.emit('startCustomMatch', {
            room: room,
            username: username,
         });
      } else {
         console.log('not the host')
      }
   }

   const handleReadyUp = () => {
      // only non host players can ready (host is always ready)
      if (!username.host) {
         setIsReady(!isReady);
      }
   }

   useEffect(() => {
      // if not host and is ready
      if (isReady && !username.host) {
         setButtonClass('button-ready');
         socket.emit('readyCustomMatch', {
            room: room,
            username: username,
         });
      // if not host and is NOT ready
      } else if (!isReady && !username.host) {
         setButtonClass('button-unready');
         socket.emit('unreadyCustomMatch', {
            room: room,
            username: username,
         }) 
      } else if (username.host) {
         setButtonClass('button-ready');
         socket.emit('readyCustomMatch', {
            room: room,
            username: username,
         });
      }
   }, [isReady]);

   useEffect(() => {
      // ongoing game is occuring
      socket.on('gameOngoing', data => {
         if (data.username.id == username.id) {
            console.log(data.msg);
         }
      });

      // a user is now ready
      socket.on('confirmReady', data => {
         addNotification(data.msg, data.room);
      });

      // a user is now NOT ready
      socket.on('confirmUnready', data => {
         addNotification(data.msg, data.room);
      });

      // game is starting
		socket.on('prepMatch', data => {
			prepMatch(data.players, data.roundAmount, data.rounds);
         incCurrentRound();
         console.log('match is starting')
		});

      return () => {
         socket.off('gameOngoing');
         socket.off('confirmReady');
         socket.off('confirmUnready');
         socket.off('prepMatch');
      }
   }, []);

   return (
      <div className='customroom-container'>
         {currentRound === 0 &&
            <div className='customroom-lobby'>
               <div className='customroom-title'>
                  <h1>{room}</h1>
               </div>
               <ChatBox socket={socket} room={room} username={username.name}/>
               <div className='customroom-buttons'>
                  <button onClick={handleStartGame}>
                     Start Game
                  </button>
                  <button className={buttonClass} onClick={handleReadyUp}>
                     Ready
                  </button>
               </div>
            </div>
         }
         {!complete.status && currentRound > 0 &&
            <Match socket={socket} room={room} username={username}/>
         }
         {complete.status && 
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
				</div>
			}
      </div>
   )
}