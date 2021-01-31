import { useState } from 'react';

export default function CreateRoom({ socket, username, toggleRoom }) {

   const [formInfo, setFormInfo] = useState({
		roomName: '',
		maxCapacity: 1,
		amountOfRounds: 1,
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
			console.log(`form is fully complete: ${formInfo}`);
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
      <div className='create-room'>
         <form>
            <label className='create-room-name'> 
               Room Name
               <input type="text" name='roomName' value={formInfo.roomName} onChange={handleFormChange} autoComplete='off'/>
            </label>
            <label>
               Max Number of Users
               <select name='maxCapacity' value={formInfo.maxCapacity} onChange={handleFormChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
               </select>
            </label>
            <label>
               Number of Rounds
               <select name="amountOfRounds" value={formInfo.amountOfRounds} onChange={handleFormChange}>
                  <option value="1">1</option>
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
            </label>
            <label className='incorrect-select'>
               Incorrect Method
               <select name="incorrectMethod" value={formInfo.incorrectMethod} onChange={handleFormChange}>
                  <option value="continue">Continue</option>
                  <option value="repeat">Repeat</option>
               </select>
            </label>
            <label className='elimination-gap-select'>
               DM Elimination Gap
               <select name="dmEliminationGap" value={formInfo.dmEliminationGap} onChange={handleFormChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
               </select>
            </label>
            <div className='create-room-submit'>
               <button type="submit" onClick={confirmCreateRoom}>
                  Create Room
               </button>
            </div>
            <div className='create-room-cancel'>
               <button onClick={toggleRoom}>
                  Cancel Room
               </button>
            </div>
         </form>
      </div>
   )
}