const randomNumber = require('../../global_functions/function_number_generator.js');
const nonzeroNumber = require('../../global_functions/function_number_generator_nonzero.js');
const infinite_check = require('../local_equations/infinite_checker_one_eq.js');

function equations_level_2 (max) {

    const coeff_1 = nonzeroNumber(1, max);
    const coeff_2 = nonzeroNumber(1, max);
    const coeff_3 = nonzeroNumber(1, max);
    const coeff_4 = nonzeroNumber(1, max);

    // max value generated is the number of questions designed
    const rng = randomNumber(1,5);

    let answer;
    let question;

    let infinite = 0;

    // if you add or remove questions, update the infinite checker script in the local equations folder **********

    if (rng === 1) { // A+BX = CX+D, solve for D, x = coeff_1
        infinite = infinite_check(2, rng, coeff_1, coeff_2, coeff_3, coeff_4, 0, 0, 0, 0);
        answer = coeff_1;
        question = `${coeff_2} + ${coeff_3}X = ${coeff_4}X + ${coeff_2 + coeff_1*(coeff_3-coeff_4)}`;
    } else if (rng === 2) { // A + BX = C, solve for C, x = coeff_1
        answer = coeff_1;
        question = `${coeff_2} + ${coeff_3}X = ${coeff_2 + coeff_1*coeff_3}`;
    } else if (rng === 3) { // A + X/B = C, solve for X
        answer = (coeff_3 - coeff_1) * coeff_2;
        question = `${coeff_1} + X/${coeff_2} = ${coeff_3}`;
    } else if (rng === 4) { // A = B(C+DX), solve for C, x = coeff_1, A = coeff_2*coeff_3, B = coeff_2, A/B = coeff_3
        answer = coeff_1;
        question = `${coeff_2*coeff_3} = ${coeff_2}( ${coeff_3 - coeff_4*coeff_1} + ${coeff_4}X)`;
    } else if (rng === 5) { // A + BX + C + DX = 0, solve for B, x = coeff_1, A = coeff_*coeff_2, C = coeff_1*coeff_3
        infinite = infinite_check(2, rng, coeff_1, coeff_2, coeff_3, coeff_4, 0, 0, 0, 0);
        answer = coeff_1;
        question = `${coeff_1*coeff_2} + ${-coeff_2 - coeff_3 - coeff_4}X + ${coeff_1*coeff_3} + ${coeff_4}X = 0`;
    }

    return {
        question: question,
        answer: answer,
        infinite: infinite,
    }

}

module.exports = equations_level_2;