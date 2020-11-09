import create from 'zustand';

export const [useNormalRound] = create((set, get) => ({
   questions: [],
   answers: [],
   currentQuestion: '',
   currentAnswer: '',
   initialResponseTimer: 0, 
   userAnswers: [],
   userResponseTimes: [],
   setRoundQuestions: (questions, answers) => {
      set(() => ({
         questions: questions,
         answers: answers,
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
      } else {
         set(() => ({
            currentAnswer: '',
         }));
         return false;
      }
   },
   resetRoundState: () => {
      set(() => ({
         questions: [],
         answers: [],
         currentQuestion: '',
         currentAnswer: '',
         initialResponseTimer: 0, 
         userAnswers: [],
         userResponseTimes: [],
      }));
   }
}));