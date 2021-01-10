export default function InQueue({ room, leaveQueue }) {

   return (
      <div className='inqueue-container'>
         <h1>{room}</h1>
         <div className='searching-block'>
            <h1>SEARCHING FOR GAME...</h1>
            <button className='button-1' onClick={leaveQueue}>
               Leave Queue
            </button>
         </div>
      </div>
   )
}