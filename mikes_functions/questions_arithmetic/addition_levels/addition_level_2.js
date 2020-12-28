const randomNumber = require('../../global_functions/function_number_generator.js');

function addition_level_2 (min ,max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);
    const term_3 = randomNumber(min, max);

    const answer = term_1 + term_2 + term_3;

    const question = `${term_1} + ${term_2} + ${term_3}`

    const terms = {
        term_1: term_1,
        term_2: term_2,
        term_3: term_3,
    }

    return {
        terms: terms,
        question: question,
        answer: answer,
    }

}

module.exports = addition_level_2; 