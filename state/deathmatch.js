import create from 'zustand';

export const [useDeathMatch] = create((set, get) => ({
   start: false,
   questions: [],
   answers: [],
   currentQuestion: '',
   currentAnswer: '',
   userAnswers: [],
   initialResponseTimer: 0,
   userResponseTimes: [],
   startDM: (socket, room) => {
      socket.emit('initiateDM', {
         msg: 'deathmatch is starting',
         room: room,
      });
      set(() => ({
         start: true,
      }));
   },
   setDMQuestions: (questions, answers) => {
      set(() => ({
         questions: questions,
         answers: answers,
      }));
   },
   loadDMQuestion: () => {
      set(prevState => ({
         currentQuestion: prevState.questions.shift(),
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
   checkAnswer: (questionNumber) => {
      if (parseFloat(get().currentAnswer) === get().answers[questionNumber - 1]) {
         return true;
      } else return false;
   },
   resetDM: () => {
      set(() => ({
         start: false,
         questions: [],
         answers: [],
         currentQuestion: '',
         currentAnswer: '',
         userAnswers: [],
         initialResponseTimer: 0,
         userResponseTimes: [],
      }));
   }
}));