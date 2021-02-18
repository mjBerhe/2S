import create from 'zustand';

export const [useCustomRoom] = create((set, get) => ({
   rooms: {

   },
   addCustomRoom: (roomName, hostName, hostID, maxCapacity) => {
      set(prevState => ({
         rooms: {
            ...prevState.rooms,
            [roomName]: {
               hostName: hostName,
               hostID: hostID,
               maxCapacity: maxCapacity,
            }
         }
      }));
   },
   updateCustomRooms: (customRooms) => {
      set(() => ({
         rooms: customRooms, 
      }))
   }
}))