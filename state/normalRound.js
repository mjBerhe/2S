import create from 'zustand';

export const [useNormalRound] = create((set, get) => ({
   questionType: null,
   incorrectMethod: null,
   questions: [],
   terms: [],
   answers: [],
   currentQuestion: '',
   currentAnswer: '',
   initialResponseTimer: 0, 
   userAnswers: [],
   userResponseTimes: [],
   setRoundInfo: (roundsInfo) => {
      set(() => ({
         questionType: roundsInfo.questionType,
         incorrectMethod: roundsInfo.incorrectMethod,
         questions: roundsInfo.questions,
         terms: roundsInfo.terms,
         answers: roundsInfo.answers,
      }));
   },
   loadQuestion: () => {
      const terms = get().terms;
      set(() => ({
         currentQuestion: terms.shift(),
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
         questionType: null,
         incorrectMethod: null,
         questions: [],
         terms: [],
         answers: [],
         currentQuestion: '',
         currentAnswer: '',
         initialResponseTimer: 0, 
         userAnswers: [],
         userResponseTimes: [],
      }));
   }
}));