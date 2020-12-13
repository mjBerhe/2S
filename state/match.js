import create from 'zustand';

export const [useMatch] = create((set, get) => ({
   queue: false,
   start: false,
   completed: {
      status: false,
      winner: {
         id: null,
         name: null,
      },
   },
   roundStatus: {
      start: false,
      showStats: false,
   },
   DMStatus: {
      start: false,
      waiting: false,
   },
   roundAmount: 0,
   currentRound: 0,
   players: [],
   roundsInfo: null,
   roundStats: {},
   completedStats: {},
   joinQueue: () => {
      set(() => ({
         queue: true,
      }));
   },
   leaveQueue: () => {
      set(() => ({
         queue: false,
      }));
   },
   prepMatch: (players, roundAmount, rounds) => {
      set(() => ({
         roundAmount: roundAmount,
         roundsInfo: rounds,
         queue: false,
         players: players,
      }));
   },
   startMatch: () => {
      set(() => ({
         start: true,
      }));
   },
   incCurrentRound: () => {
      const currentRound = get().currentRound;
      set(() => ({
         roundStatus: {
            start: false,
            showStats: false,
         },
         currentRound: currentRound + 1,
      }));
      console.log(`starting round ${get().currentRound}`);
   },
   startRound: () => {
      set(() => ({
         roundStatus: {
            start: true,
            showStats: false,
         }
      }));
   },
   finishedRound: () => {
      set(() => ({
         roundStatus: {
            start: false,
            showStats: false,
         },
      }));
   },
   showRoundStats: (stats) => {
      set(() => ({
         roundStatus: {
            start: false,
            showStats: true,
         },
         roundStats: stats,
      }));
   },
   startDM: (socket, room, currentRound) => {
      socket.emit('initiateDM', {
         msg: 'deathmatch is starting',
         room: room,
         currentRound: currentRound,
      });
      set(() => ({
         DMStatus: {
            start: true,
         }
      }));
   },
   eliminatedDM: () => {
      set(() => ({
         DMStatus: {
            start: false,
            waiting: true,
         }
      }));
   },
   finishDM: () => {
      set(() => ({
         DMStatus: {
            start: false,
            waiting: false,
         }
      }));
   },
   sliceQuestions: (amount, round) => {
      const roundsInfo = get().roundsInfo;
      const newQuestionsMaster = roundsInfo[`round ${round}`].questionsMaster.slice(0, amount);
      set(prevState => ({
         roundsInfo: {
            ...prevState.roundsInfo,
            [`round ${round}`]: {
               ...prevState.roundsInfo[`round ${round}`],
               questionsMaster: newQuestionsMaster,
            },
         },
      }));
   },
   completeMatch: (stats, id, name) => {
      set(() => ({
         start: false,
         completed: {
            status: true,
            winner: {
               id: id,
               name: name,
            }
         },
         completedStats: stats,
      }));
   },
   resetMatch: () => {
      set(() => ({
         queue: false,
         start: false,
         completed: {
            status: false,
            winner: {
               id: null,
               name: null,
            },
         },
         roundStatus: {
            start: false,
            showStats: false,
         },
         DMStatus: {
            start: false,
            waiting: false,
         },
         roundAmount: 0,
         currentRound: 0,
         players: [],
         roundsInfo: null,
         roundStats: {},
         completedStats: {},
      }));
   }
}));