import { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import ChatBox from './chatbox.js';
import Match from '../Match/match.js';
import CompletedStats from '../Stats/completedStats.js';
import { useChatBox } from '../../state/chatBox.js';
import { useMatch } from '../../state/match.js';
import { useUsers } from '../../state/users.js';

export default function CustomRoom({ socket, room, username, leaveRoom }) {

   const users = useUsers(state => state.users[room]);
   const { addNotification } = useChatBox();
   const { prepMatch, incCurrentRound } = useMatch();
   const { currentRound, complete } = useMatch(state => ({
      currentRound: state.currentRound,
      complete: state.completed,
   }), shallow);

   const [isReady, setIsReady] = useState(false);
   const [buttonClass, setButtonClass] = useState('button-unready');
   const [readyUsersList, setReadyUsersList] = useState([]);

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

   const checkIfReady = (userID) => {
      for (let i = 0; i < readyUsersList.length; i++) {
         if (readyUsersList[i].id === userID) {
            return true;
         }
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

      socket.on('customRoomUsers', data => {
         setReadyUsersList(data.usersReady);
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
         socket.off('customRoomUsers');
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
               <div className='customroom-leave'>
                  <input type="image" src='./Misc/black-x.png' onClick={leaveRoom}/>
               </div>
               <div className='users-room-container'>
                  {users.map(user => 
                     checkIfReady(user.id) ? 
                     <div key={user.id} className='user-ready-container'>
                        <h3>{user.name}</h3> <h4>Ready</h4>
                     </div>
                        : 
                     <div key={user.id} className='user-unready-container'>
                        <h3>{user.name}</h3> <h4>Not Ready</h4>
                     </div>
                  )}
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