import create from 'zustand';

export const [useMatch] = create((set, get) => ({
   queue: false,
   start: false,
   completed: {
      status: false,
      msg: '',
   },
   roundStatus: {
      start: false,
      showStats: false,
   },
   deathmatchOngoing: false,
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
   startDM: (socket, room) => {
      socket.emit('initiateDM', {
         msg: 'deathmatch is starting',
         room: room,
      });
      set(() => ({
         deathmatchOngoing: true,
      }));
   },
   sliceFinalRound: (amount, round) => {
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
   completeMatch: (stats, msg) => {
      set(() => ({
         start: false,
         completed: {
            status: true,
            msg: msg,
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
            msg: '',
         },
         roundStatus: {
            start: false,
            showStats: false,
         },
         deathmatchOngoing: false,
         roundAmount: 0,
         currentRound: 0,
         players: [],
         roundsInfo: null,
         completedStats: {},
      }));
   }
}));