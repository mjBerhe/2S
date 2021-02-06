import { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import ChatBox from './chatbox.js';
import Match from '../Match/match.js';
import CompletedStats from '../Stats/completedStats.js';
import { useChatBox } from '../../state/chatBox.js';
import { useMatch } from '../../state/match.js';

export default function CustomRoom({ socket, room, username, leaveRoom }) {

   const { addNotification } = useChatBox();
   const { prepMatch, incCurrentRound } = useMatch();
   const { currentRound, complete } = useMatch(state => ({
      currentRound: state.currentRound,
      complete: state.completed,
   }), shallow);

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
         // checking if you are part of this match
         data.players.forEach(player => {
            if (player.id === username.id) {
               prepMatch(data.players, data.roundAmount, data.rounds);
               incCurrentRound();
               console.log('match is starting');
            }
         })
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
				<CompletedStats leaveRoom={leaveRoom}/>
			}
      </div>
   )
}