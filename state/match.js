import create from 'zustand';

export const [useMatch] = create((set, get) => ({
   queue: false,
   start: false,
   players: [],
   questions: [],
   answers: [],
   currentAnswer: '',
   userAnswers: [],
   responseTime: [],
   joinQueue: () => {
      set(() => ({
         queue: true,
      }))
   },
   leaveQueue: () => {
      set(() => ({
         queue: false,
      }))
   },
   prepMatch: (players, questions, answers) => {
      set(() => ({
         queue: false,
         players: players,
         questions: questions,
         answers: answers,
      }));
   },
   startMatch: () => {
      set(() => ({
         start: true,
      }));
   },
   userTypingAnswer: (answer) => {
      set(() => ({
         currentAnswer: answer,
      }));
   },
   userSubmitAnswer: () => {
      set(prevState => ({
         userAnswers: [...prevState.userAnswers, prevState.currentAnswer],
         currentAnswer: '',
      }));
   }
}));