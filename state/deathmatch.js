import create from 'zustand';

export const [useDeathMatch] = create((set, get) => ({
   questionType: null,
   incorrectMethod: null,
   questions: [],
   terms: [],
   answers: [],
   currentQuestion: '',
   currentAnswer: '',
   prevAnswerCorrect: false,
   initialResponseTimer: 0,
   userAnswers: [],
   userResponseTimes: [],
   setDMInfo: (DMInfo) => {
      set(() => ({
         questionType: DMInfo.questionType,
         incorrectMethod: DMInfo.incorrectMethod,
         questions: DMInfo.questions,
         terms: DMInfo.terms,
         answers: DMInfo.answers,
      }));
   },
   loadDMQuestion: () => {
      const terms = get().terms;
      set(() => ({
         currentQuestion: terms.shift(),
         initialResponseTimer: Date.now(),
         prevAnswerCorrect: false,
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
         set(() => ({
            prevAnswerCorrect: true,
         }));
         return true;
      } else {
         set(() => ({
            prevAnswerCorrect: false,
         }));
         return false;
      }
   },
   resetDMState: () => {
      set(() => ({
         questionType: null,
         incorrectMethod: null,
         questions: [],
         terms: [],
         answers: [],
         currentQuestion: '',
         currentAnswer: '',
         prevAnswerCorrect: false,
         initialResponseTimer: 0,
         userAnswers: [],
         userResponseTimes: [],
      }));
   }
}));