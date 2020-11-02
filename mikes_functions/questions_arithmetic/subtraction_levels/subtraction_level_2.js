const randomNumber = require('../../global_functions/function_number_generator.js');

module.exports = function subtraction_level_2 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, term_1);
    const term_3 = randomNumber(min, term_2);

    const answer = term_1 - term_2 - term_3;

    const question = `What is ${term_1} - ${term_2} - ${term_3} ?` ;

    return {
        question: question,
        answer: answer,
    }

}