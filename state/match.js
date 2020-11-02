import create from 'zustand';

export const [useMatch] = create((set, get) => ({
   queue: false,
   start: false,
   completed: {
      status: false,
      msg: '',
   },
   roundOngoing: false,
   roundAmount: 0,
   currentRound: 0,
   players: [],
   roundsInfo: null,
   currentRoundQuestions: [],
   currentQuestion: '',
   currentAnswer: '',
   initialResponseTimer: 0, 
   userAnswers: [],
   userResponseTimes: [],
   completedStats: {},
   joinQueue: () => {
      set(() => ({
         queue: true,
      }));
   },
   leaveQueue: () => {
      set(() => ({
         queue: false,
      }))
       
   },
   prepMatch: (players, roundAmount, rounds) => {
      set(() => ({
         roundAmount: roundAmount,
         roundsInfo: rounds,
         queue: false,
         players: players,
      }));
   },
   incCurrentRound: () => {
      set(prevState => ({
         roundOngoing: true,
         currentRound: prevState.currentRound + 1,
         userAnswers: [],
         userResponseTimes: [],
      }));
      console.log('incrementing round')
   },
   finishedRound: () => {
      set(() => ({
         roundOngoing: false,
      }));
   },
   startMatch: () => {
      set(() => ({
         start: true,
      }));
   },
   setRoundQuestions: (currentRound) => {
      const roundsInfo = get().roundsInfo;
      set(() => ({
         currentRoundQuestions: roundsInfo[currentRound].questions,
      }));
   },
   loadQuestion: () => {
      const questions = get().currentRoundQuestions;
      set(() => ({
         currentQuestion: questions.shift(),
         initialResponseTimer: Date.now(),
      }));
   },
   userTypingAnswer: (answer) => {
      set(() => ({
         currentAnswer: answer,
      }));
   },
   userSubmitAnswer: () => {
      set(prevState => ({
         userAnswers: [...prevState.userAnswers, parseFloat(prevState.currentAnswer)],
         currentAnswer: '',
         userResponseTimes: [...prevState.userResponseTimes, Date.now() - prevState.initialResponseTimer],
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
         roundOngoing: false,
         roundAmount: 0,
         currentRound: 0,
         players: [],
         roundsInfo: null,
         currentRoundQuestions: [],
         currentQuestion: '',
         currentAnswer: '',
         initialResponseTimer: 0, 
         userAnswers: [],
         userResponseTimes: [],
         completedStats: {},
      }));
   }
}));