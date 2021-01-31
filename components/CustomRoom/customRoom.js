import { useEffect, useState } from 'react';
import ChatBox from '../chatbox.js';

export default function CustomRoom({ socket, room, username, handleLeaveRoom }) {

   const handleStartGame = () => {
      if (username.host) {
         console.log('this button works because u are the host')
      } else {
         console.log('not the host')
      }
   }

   return (
      <div className='customroom-container'>
         <h1>{room}</h1>
         <ChatBox socket={socket} room={room} username={username.name}/>
         <button onClick={handleStartGame}>
            Start Game
         </button>
      </div>
   )
}