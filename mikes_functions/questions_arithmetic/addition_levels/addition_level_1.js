const randomNumber = require('../../global_functions/function_number_generator.js');

function addition_level_1 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);

    const answer = term_1 + term_2;

    const question = `${term_1} + ${term_2}`

    const terms = {
        term_1: term_1,
        term_2: term_2,
    }

    return {
        terms: terms,
        answer: answer,
        question: question,
    }

}

module.exports = addition_level_1; 