const randomNumber = require('../../global_functions/function_number_generator.js');

module.exports = function subtraction_level_3 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);
    const term_3 = randomNumber(min, max);
    const term_4 = randomNumber(min, max);

    const answer = term_1 - term_2 - term_3 - term_4;

    const question = `What is ${term_1} - ${term_2} - ${term_3} - ${term_4} ?` ;

    return {
        question: question,
        answer: answer,
    }

}