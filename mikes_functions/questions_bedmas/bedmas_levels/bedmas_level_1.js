const randomNumber = require('../../global_functions/function_number_generator.js');
const nonzeroNumber = require('../../global_functions/function_number_generator_nonzero.js');

function bedmas_level_1 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = nonzeroNumber(1, max);
    const term_3 = randomNumber(min, max);

    // max value generated is the number of questions designed
    const rng = randomNumber(1,3);

    let answer;
    let terms;

    if (rng === 1) {
        answer = term_1 * ( term_2 + term_3 );
        
        terms = {
            term_1: term_1,
            term_2: term_2,
            term_3: term_3,
        }

    } else if (rng === 2) {
        answer = term_1;
        
        terms = {
            term_1: term_2*(term_1 - term_3),
            term_2: term_2,
            term_3: term_3
        }

    } else if (rng === 3) {
        answer = term_1 * term_2 + term_3;
        
        terms = {
            term_1: term_1,
            term_2: term_2,
            term_3: term_3,
        }
    }

    return {
        question_type: rng,
        terms: terms,
        answer: answer,
    }

}

module.exports = bedmas_level_1;