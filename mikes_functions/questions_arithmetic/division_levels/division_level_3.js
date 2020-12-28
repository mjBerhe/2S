const randomNumber = require('../../global_functions/function_number_generator.js');

function division_level_3 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);
    const term_3 = randomNumber(min, max);
    const term_4 = randomNumber(min, max);

    const product = term_1 * term_2 * term_3 * term_4;

    const question = `${product} / ${term_1} / ${term_2} / ${term_3}`

    const terms = {
        term_1: product,
        term_2: term_1,
        term_3: term_2,
        term_4: term_3,
    }

    return {
        terms: terms,
        answer: term_4,
        question: question,
    }

}

module.exports = division_level_3; 
