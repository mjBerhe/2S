import { useEffect, useState } from 'react';
import ChatBox from './chatbox.js';
import { useChatBox } from '../../state/chatBox.js';
import { useUsers } from '../../state/users.js';

export default function CustomRoom({ socket, room, username, handleLeaveRoom }) {

   const { addNotification } = useChatBox();

   const [isReady, setIsReady] = useState(false);
   const [buttonClass, setButtonClass] = useState('button-unready');

   const handleStartGame = () => {
      if (username.host) {
         console.log('this button works because u are the host')
      } else {
         console.log('not the host')
      }
   }

   const handleReadyUp = () => {
      if (!username.host) {
         setIsReady(!isReady);
      }
   }

   useEffect(() => {
      // if not host and is ready
      if (isReady && !username.host) {
         setButtonClass('button-ready');
         socket.emit('readyCustomMatch', { // working on these
            room: room,
            username: username,
         });
      // if not host and is NOT ready
      } else if (!isReady && !username.host) { // working on these
         setButtonClass('button-unready');
         socket.emit('unreadyCustomMatch', {
            room: room,
            username: username,
         }) 
      } else if (username.host) {
         setButtonClass('button-ready');
      }
   }, [isReady]);

   useEffect(() => {
      socket.on('gameOngoing', data => {
         if (data.username.id == username.id) {
            console.log(data.msg);
         }
      });
      socket.on('confirmReady', data => {
         addNotification(data.msg, data.room);
      });
      socket.on('confirmUnready', data => {
         addNotification(data.msg, data.room);
      });

      return () => {
         socket.off('gameOngoing');
         socket.off('confirmReady');
      }
   }, []);

   return (
      <div className='customroom-container'>
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
   )
}