import { useEffect, useState } from 'react';
import ChatBox from '../chatbox.js';

export default function CustomRoom({ socket, room, username, handleLeaveRoom }) {

   return (
      <div className='customroom-container'>
         <h1>{room}</h1>
         <ChatBox socket={socket} room={room} username={username.name}/>
      </div>
   )
}