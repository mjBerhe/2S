const addition = require('../mikes_functions/question_addition.js');
const multiplication = require('../mikes_functions/question_multiplication.js');
// can make either a static room or random room

module.exports = function generateStaticRoom (maxCapacity, roundAmount, arrayOfRoundTypes) {
   if (arrayOfRoundTypes.length !== roundAmount) {
      return 0;
   }

   const functionConverter = {
      'addition': addition(3, 30, 0, 2, 0),
      'multiplication': multiplication(3, 12, 2, 2, 0),
   }

   const listOfRounds = [
      'round 1',
      'round 2',
      'round 3',
      'round 4',
      'round 5',
      'round 6',
      'round 7',
      'round 8',
      'round 9',
      'round 10',
   ];

   const rounds = {};

   // generating rounds
   arrayOfRoundTypes.forEach((roundType, i) => {
      const {questions, answers} = functionConverter[roundType];
      rounds[listOfRounds[i]] = {
         roundType: roundType,
         questions: questions,
         answers: answers,
         results: [],
      }
   })

   return {
      start: false,
      maxCapacity: maxCapacity,
      roundAmount: roundAmount,
      users: [],
      queue: [],
      rounds: rounds,
   };
}

// console.log(generateStaticRoom(2, 2, ['addition', 'multiplication']))