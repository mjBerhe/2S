const randomNumber = require('../../global_functions/function_number_generator.js');

function multiplication_level_3 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);
    const term_3 = randomNumber(min, max);
    const term_4 = randomNumber(min, max);

    const answer = term_1 * term_2 * term_3 * term_4;

    const question = `${term_1} * ${term_2} * ${term_3} * ${term_4}`

    const terms = {
        term_1: term_1,
        term_2: term_2,
        term_3: term_3,
        term_4: term_4,
    }

    return {
        terms: terms,
        answer: answer,
        question: question,
    }

}

module.exports = multiplication_level_3; 