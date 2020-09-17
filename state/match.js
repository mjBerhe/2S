import create from 'zustand';

export const [useMatch] = create((set, get) => ({
   queue: false,
   start: false,
   completed: false,
   players: [],
   questions: [],
   answers: [],
   currentQuestion: '',
   currentAnswer: '',
   userAnswers: [],
   initialResponseTimer: 0, 
   userResponseTimes: [],
   results: [],
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
   prepMatch: (players, questions) => {
      const q = [];
      const a = [];

      questions.forEach(item => {
         q.push(item.question);
         a.push(item.answer);
      });

      set(() => ({
         queue: false,
         players: players,
         questions: q,
         answers: a,
      }));
   },
   startMatch: () => {
      set(() => ({
         start: true,
      }));
   },
   completeMatch: () => {
      set(() => ({
         start: false,
         completed: true,
      }));
   },
   loadQuestion: () => {
      const questions = get().questions;
      set(() => ({
         currentQuestion: questions.shift(),
         initialResponseTimer: Date.now(),
      }));
   },
   userTypingAnswer: (answer) => {
      set(() => ({
         currentAnswer: parseInt(answer, 10),
      }));
   },
   userSubmitAnswer: () => {
      const initialTime = get().initialResponseTimer;
      set(prevState => ({
         userAnswers: [...prevState.userAnswers, prevState.currentAnswer],
         currentAnswer: '',
         userResponseTimes: [...prevState.userResponseTimes, Date.now() - initialTime],
      }));
   },
   setResults: (results) => {
      set(() => ({
         results: results,
      }));
   },
   resetMatch: () => {
      set(() => ({
         queue: false,
         start: false,
         completed: false,
         players: [],
         questions: [],
         answers: [],
         currentQuestion: '',
         currentAnswer: '',
         userAnswers: [],
         initialResponseTimer: 0, 
         userResponseTimes: [],
         results: [],
      }));
   }
}));