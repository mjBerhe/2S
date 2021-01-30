import create from 'zustand'

export const [useChatBox] = create((set, get) => ({
   rooms: {

   },
   addRoomChat: (roomName) => {
      const rooms = get().rooms;
      if (!rooms[roomName]) {
         set(() => ({
            rooms: {
               [roomName]: [],
            }
         }));
      }
   },
   addMessage: (message, username, roomName) => {
      set(prevRoomChat => ({
         rooms: {
            [roomName]: [...prevRoomChat.rooms[roomName], {
               message: message,
               username: username,
            }]
         }
      }));
   },
   addNotification: (message, roomName) => {
      set(prevRoomChat => ({
         rooms: {
            [roomName]: [...prevRoomChat.rooms[roomName], {
               message: message
            }]
         }
      }));
   }
}))