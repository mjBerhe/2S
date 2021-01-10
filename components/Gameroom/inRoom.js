export default function InRoom({ room, findGame, leaveRoom }) {

   return (
      <div className='inroom-container'>
         <h1>{room}</h1>
         <div className='search-game-button'>
            <button className="button-1" onClick={findGame}>
               Look for Game
            </button>
         </div>
         <div className='leave-room-button'>
				<button className='button-1' onClick={leaveRoom}>
					Leave Room
				</button>
			</div>
      </div>
   );
}