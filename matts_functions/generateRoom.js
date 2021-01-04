const e = require('express');
const addition = require('../mikes_functions/questions_arithmetic/template_addition.js');
const division = require('../mikes_functions/questions_arithmetic/template_division.js');
const multiplication = require('../mikes_functions/questions_arithmetic/template_multiplication.js');
const subtraction = require('../mikes_functions/questions_arithmetic/template_subtraction.js');
const bedmas = require('../mikes_functions/questions_bedmas/template_bedmas.js');
const equations = require('../mikes_functions/questions_equations/template_equations.js');
const additive = require('../mikes_functions/questions_sequences/template_additive.js');
const geometric = require('../mikes_functions/questions_sequences/template_geometric.js');
// can make either a static room or random room

const functionConverter = {
   'additionTest': addition(2, 1, 1, 20),
   'subtractionTest': subtraction(2, 1, 1, 30),
   'multiplicationTest': multiplication(2, 1, 1, 12),
   'divisionTest': division(2, 1, 1, 10),
   'bedmasTest': bedmas(3, 1, 1, 10),
   'additionDM': addition(30, 1, 1, 20),
   'multiplicationDM': multiplication(30, 1, 1, 12),
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

function generateStaticRoom (maxCapacity, roundAmount, arrayOfQuestionTypes) {
   if (arrayOfQuestionTypes.length !== roundAmount) {
      return 0; // not valid
   }

   // generating list of round names
   const listOfRounds = []; // ['round 1', 'round 2', ...]

   for (let i = 1; i <= roundAmount; i++) {
      listOfRounds.push(`round ${i}`);
   }

   // generating rounds
   const rounds = {};
   
   arrayOfQuestionTypes.forEach((questionType, i) => { // looping through each given round
      if (!functionConverter[questionType]) { // question type doesn't exist
         console.log('error, question type does not exist');
      } else { 
         if (i === roundAmount - 1) { // last round (deathmatch)
         // if (i > 0) {
            const {terms, questions, answers, type} = functionConverter[questionType];
            rounds[listOfRounds[i]] = {
               questionType: type, // i.e addition, subtraction, etc
               deathmatchRound: true,
               deathmatch: [],
               incorrectMethod: 'continue', // can be continue or repeat*
               questionsMaster: questions,
               questions: questions,
               terms: terms,
               answers: answers,
               results: [],
            }
         } else { // normal round
            const {terms, questions, answers, type} = functionConverter[questionType];
            rounds[listOfRounds[i]] = {
               questionType: type, // i.e addition, subtraction, etc
               deathmatchRound: false,
               deathmatch: [],
               incorrectMethod: 'continue', // can be continue or repeat*
               questionsMaster: questions,
               questions: questions,
               terms: terms,
               answers: answers,
               results: [],
            }
         }
      }
   });

   return {
      start: false,
      maxCapacity: maxCapacity,
      roundAmount: roundAmount,
      users: [],
      queue: [],
      roundQueue: [],
      rounds: rounds,
   };
}

function generateDeathmatchRoom (maxCapacity, roundAmount, arrayOfQuestionTypes) {
   if (arrayOfQuestionTypes.length !== roundAmount) {
      return 0; // not valid
   }

   // generating list of round names
   const listOfRounds = []; // ['round 1', 'round 2', ...]

   for (let i = 1; i <= roundAmount; i++) {
      listOfRounds.push(`round ${i}`);
   }

   // generating rounds
   const rounds = {};
   
   arrayOfQuestionTypes.forEach((questionType, i) => { // looping through each given round
      if (!functionConverter[questionType]) { // question type doesn't exist
         console.log('error, question type does not exist');
      } else { 
         const {questions, answers} = functionConverter[questionType];
         rounds[listOfRounds[i]] = {
            questionType: questionType,
            deathmatchRound: true,
            deathmatch: [],
            incorrectMethod: 'continue', // can be continue or repeat*
            questionsMaster: questions,
            questions: questions,
            answers: answers,
            results: [],
         }
      }
   });

   return {
      start: false,
      maxCapacity: maxCapacity,
      roundAmount: roundAmount,
      users: [],
      queue: [],
      roundQueue: [],
      rounds: rounds,
   };
}

// console.log(generateStaticRoom(2, 2, ['addition', 'multiplication']))

exports.static = generateStaticRoom;
exports.deathmatch = generateDeathmatchRoom;