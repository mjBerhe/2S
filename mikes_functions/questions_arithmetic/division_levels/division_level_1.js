const randomNumber = require('../../global_functions/function_number_generator.js');

function division_level_1 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);

    const product = term_1 * term_2;

    const question = `${product} / ${term_1}`

    const terms = {
        term_1: product,
        term_2: term_1,
    }

    return {
        terms: terms,
        answer: term_2,
        question: question,
    }

}

module.exports = division_level_1; 
