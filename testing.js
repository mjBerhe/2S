module.exports = function makeQuestions () {
   const first_array = ['5x4', '3x3', '8x3'];
   const second_array = [20, 9, 24];

   const questions = [];

   for (let i = 0; i < first_array.length; i ++) {
      questions.push({
         question: first_array[i],
         answer: second_array[i],
      });
   }

   return questions;
}