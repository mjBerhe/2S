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
      const roomChat = get().rooms[roomName];
      if (roomChat) { // must check if a previous chat exists
         set(() => ({
            rooms: {
               [roomName]: [...roomChat, {
                  message: message,
                  username: username,
               }]
            }
         }));
      }
   },
   addNotification: (message, roomName) => {
      const roomChat = get().rooms[roomName];
      if (roomChat) { // must check if a previous chat exists
         set(() => ({
            rooms: {
               [roomName]: [...roomChat, {
                  message: message
               }]
            }
         }));
      }
   }
}))