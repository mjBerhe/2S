const randomNumber = require('../../global_functions/function_number_generator.js');

module.exports = function division_level_3 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);
    const term_3 = randomNumber(min, max);
    const term_4 = randomNumber(min, max);

    const product = term_1 * term_2 * term_3 * term_4;

    const question = `What is ${product} / ${term_1} / ${term_2} / ${term_3} ?`

    return {
        question: question,
        answer: term_4,
    }

}
