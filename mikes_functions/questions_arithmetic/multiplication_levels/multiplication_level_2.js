const randomNumber = require('../../global_functions/function_number_generator.js');

module.exports = function multiplication_level_2 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);
    const term_3 = randomNumber(min, max);

    const answer = term_1 * term_2 * term_3;

    const question = `What is ${term_1} * ${term_2} * ${term_3} ?`

    return {
        question: question,
        answer: answer,
    }

}