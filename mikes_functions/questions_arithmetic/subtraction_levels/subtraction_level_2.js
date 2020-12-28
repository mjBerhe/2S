const randomNumber = require('../../global_functions/function_number_generator.js');

module.exports = function subtraction_level_2 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, term_1);
    const term_3 = randomNumber(min, term_2);

    const answer = term_1 - term_2 - term_3;

    const question = `${term_1} - ${term_2} - ${term_3}` ;

    const terms = {
        term_1: term_1,
        term_2: term_2,
        term_3: term_3,
    }

    return {
        terms: terms,
        answer: answer,
        question: question,
    }

}

module.exports = subtraction_level_2;