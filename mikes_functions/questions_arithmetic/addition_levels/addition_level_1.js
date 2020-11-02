const randomNumber = require('../../global_functions/function_number_generator.js');

module.exports = function addition_level_1 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);

    const answer = term_1 + term_2;

    const question = `What is ${term_1} + ${term_2} ?`

    return {
        question: question,
        answer: answer,
    }

}