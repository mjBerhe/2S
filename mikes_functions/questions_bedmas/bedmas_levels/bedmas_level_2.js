const randomNumber = require('../../global_functions/function_number_generator.js');

function bedmas_level_2 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);
    const term_3 = randomNumber(min, max);
    const term_4 = randomNumber(min, max);
    const term_5 = randomNumber(min, max);

    // max value generated is the number of questions designed
    const rng = randomNumber(1, 4);

    let answer;
    let terms;

    if (rng === 1) {
        answer = term_1 * (term_2 + term_3 + term_4) + term_5;

        terms = {
            term_1: term_1,
            term_2: term_2,
            term_3: term_3,
            term_4: term_4,
            term_5: term_5,
        }

    } else if (rng === 2) {
        answer = (term_1 + term_2) * (term_3 + term_4) + term_5;

        terms = {
            term_1: term_1,
            term_2: term_2,
            term_3: term_3,
            term_4: term_4,
            term_5: term_5,
        }

    } else if (rng === 3) {
        answer = term_1 * term_2 + term_3 + term_4 * term_5;

        terms = {
            term_1: term_1,
            term_2: term_2,
            term_3: term_3,
            term_4: term_4,
            term_5: term_5,
        }

    } else if (rng === 4) {
        answer = term_1 * (term_2 + term_3) + term_4 + term_5;

        terms = {
            term_1: term_1,
            term_2: term_2,
            term_3: term_3,
            term_4: term_4,
            term_5: term_5,
        }

    }

    return {
        question_type: rng,
        terms: terms,
        answer: answer,
    }

}

module.exports = bedmas_level_2;