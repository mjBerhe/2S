const addition = require('../mikes_functions/question_addition.js');
const multiplication = require('../mikes_functions/question_multiplication.js');
const equations = require('../mikes_functions/question_equations.js');
// can make either a static room or random room

function generateStaticRoom (maxCapacity, roundAmount, arrayOfRoundTypes) {
   if (arrayOfRoundTypes.length !== roundAmount) {
      return 0;
   }

   const functionConverter = {
      'addition': addition(1, 30, 0, 2, 0),
      'multiplication': multiplication(10, 12, 2, 2, 0),
      'equations_1': equations(3, 1, 1),
      'equations_2': equations(3, 1, 2),
      'equations_3': equations(3, 2, 1),
   }

   // generating list of round names
   const listOfRounds = []; // ['round 1', 'round 2', ...]

   for (let i = 1; i <= roundAmount; i++) {
      listOfRounds.push(`round ${i}`);
   }

   // generating rounds
   const rounds = {};
   
   arrayOfRoundTypes.forEach((roundType, i) => {
      const {questions, answers} = functionConverter[roundType];
      rounds[listOfRounds[i]] = {
         roundType: roundType,
         questions: questions,
         answers: answers,
         results: [],
      }
   });

   return {
      start: false,
      maxCapacity: maxCapacity,
      roundAmount: roundAmount,
      users: [],
      queue: [],
      rounds: rounds,
      deathmatch: [],
   };
}

// console.log(generateStaticRoom(2, 2, ['addition', 'multiplication']))

exports.static = generateStaticRoom;