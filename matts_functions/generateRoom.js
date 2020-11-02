const addition = require('../mikes_functions/template_addition.js');
const division = require('../mikes_functions/template_division.js');
const multiplication = require('../mikes_functions/template_multiplication.js');
const subtraction = require('../mikes_functions/template_subtraction.js');
const bedmas = require('../mikes_functions/template_bedmas.js');
const equations = require('../mikes_functions/template_equations.js');
const additive = require('../mikes_functions/template_additive.js');
const geometric = require('../mikes_functions/template_geometric.js');
// can make either a static room or random room

function generateStaticRoom (maxCapacity, roundAmount, arrayOfRoundTypes) {
   if (arrayOfRoundTypes.length !== roundAmount) {
      return 0;
   }

   const functionConverter = {
      'addition1': addition(10, 1, 1, 30),
      'addition2': addition(10, 2, 1, 30),
      'subtraction1': subtraction(10, 1, 1, 30),
      'subtraction2': subtraction(10, 2, 1, 30),
      'multiplication1': multiplication(10, 1, 1, 12),
      'multiplication2': multiplication(10, 2, 1, 10),
      'division1': division(10, 1, 1, 12),
      'division2': division(10, 2, 1, 10),
      'bedmas1': bedmas(10, 1, 1, 10),
      'bedmas2': bedmas(10, 2, 1, 10),
      'equations1': equations(10, 1, 1, 3),
      'equations2': equations(10, 2, 1, 3),
      'additive': additive(100),
      'geometric': geometric(10),
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