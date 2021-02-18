import { useState } from 'react';

export default function CreateRoom({ socket, username, toggleRoom }) {

   const [formInfo, setFormInfo] = useState({
		roomName: '',
		maxCapacity: 2,
		amountOfRounds: 2,
		incorrectMethod: 'continue',
		dmEliminationGap: 1,
   });
   
   const handleFormChange = (e) => {
		const formName = e.target.name;
		const formValue = e.target.value;

		setFormInfo(prevForm => ({
			...prevForm,
			[formName]: formValue,
		}));
   }
   
   // confirms form is valid and sends info to server
	const confirmCreateRoom = (e) => {
		e.preventDefault();
		if (formInfo.roomName && formInfo.maxCapacity && formInfo.amountOfRounds && formInfo.dmEliminationGap && formInfo.incorrectMethod) {
			console.log('room successfully created');
			socket.emit('createRoom', {
				username: username,
				roomName: formInfo.roomName,
				maxCapacity: formInfo.maxCapacity,
				amountOfRounds: formInfo.amountOfRounds,
				incorrectMethod: formInfo.incorrectMethod,
				dmEliminationGap: formInfo.dmEliminationGap,
			});

         toggleRoom();
		} else {
			console.log('form is not complete')
		}
	}

   return (
      <div className='create-room-container'>
         <form>
            <div className='create-room-name'> 
               <input type="text" name='roomName' value={formInfo.roomName} onChange={handleFormChange} autoComplete='off' autoFocus={true} placeholder='Room Name' maxLength='16'/>
            </div>
            <div className='create-room-cancel'>
               <input type='image' src='/Misc/purple-x.png' onClick={toggleRoom}/>
            </div>
            <div className='create-room-form1'>
               <h3>Max Number of Users</h3>
               <select name='maxCapacity' value={formInfo.maxCapacity} onChange={handleFormChange}>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
               </select>
            </div>
            <div className='create-room-form2'>
               <h3>Number of Rounds</h3>
               <select name="amountOfRounds" value={formInfo.amountOfRounds} onChange={handleFormChange}>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
               </select>
            </div>
            <div className='create-room-form3'>
               <h3>Incorrect Method</h3>
               <select name="incorrectMethod" value={formInfo.incorrectMethod} onChange={handleFormChange}>
                  <option value="continue">Continue</option>
                  <option value="repeat">Repeat</option>
               </select>
            </div>
            <div className='create-room-form4'>
               <h3>DM Elimination Gap</h3>
               <select name="dmEliminationGap" value={formInfo.dmEliminationGap} onChange={handleFormChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
               </select>
            </div>
            <div className='create-room-submit'>
               <button type="submit" onClick={confirmCreateRoom}>
                  Create Room
               </button>
            </div>
         </form>
      </div>
   )
}