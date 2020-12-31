const randomNumber = require('../../global_functions/function_number_generator.js');
const nonzeroNumber = require('../../global_functions/function_number_generator_nonzero.js');

function bedmas_level_3 (min, max) {

    const term_1 = randomNumber(min, max);
    const term_2 = randomNumber(min, max);
    const term_3 = randomNumber(min, max);
    const term_4 = nonzeroNumber(1, max);
    const term_5 = nonzeroNumber(1, max);
    const term_6 = randomNumber(min, max);

    const rng = randomNumber(1, 4);

    let answer;
    let terms;

    if (rng === 1) {
        question = `${term_1} + ${term_2} * (${term_3} + ${term_4}) + ${term_5*term_6}/${term_5}`
        answer = term_1 + term_2 * (term_3 + term_4) + (term_5 * term_6)/term_5;

        terms = {
            term_1: term_1,
            term_2: term_2,
            term_3: term_3,
            term_4: term_4,
            term_5: term_5*term_6,
            term_6: term_5,
        }

    } else if (rng === 2) {
        question = `${term_1} * (${term_2} + (${term_3} + ${term_4}) * (${term_5} + ${term_6})`
        answer = term_1 * (term_2 + term_3) + term_4 * (term_5 + term_6);
        
        terms = {
            term_1: term_1,
            term_2: term_2,
            term_3: term_3,
            term_4: term_4,
            term_5: term_5,
            term_6: term_6,
        }

    } else if (rng === 3) {
        question = `${term_1} * (${term_2} + ${term_3*term_4}/${term_4}) + ${term_5} * ${term_6}`
        answer = term_1 * (term_2 + (term_3*term_4)/term_4) + term_5*term_6;
        
        terms = {
            term_1: term_1,
            term_2: term_2,
            term_3: term_3*term_4,
            term_4: term_4,
            term_5: term_5,
            term_6: term_6,
        }

    } else if (rng === 4) {
        question = `${term_1} + ${term_2} * ${term_3} + ${term_4} * ${term_5} + ${term_6}`
        answer = term_1 + term_2 * term_3 + term_4 * term_5 + term_6;
        
        terms = {
            term_1: term_1,
            term_2: term_2,
            term_3: term_3,
            term_4: term_4,
            term_5: term_5,
            term_6: term_6,
        }
    }

    return {
        question: question,
        question_type: rng,
        terms: terms,
        answer: answer,
    }

}

module.exports = bedmas_level_3;
