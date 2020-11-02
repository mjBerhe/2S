const randomNumber = require('../../global_functions/function_number_generator.js');
const nonzeroNumber = require('../../global_functions/function_number_generator_nonzero.js');
const infinite_check = require('../local_equations/infinite_checker_one_eq.js');
const equationsONE_level_2 = require('./equationsONE_level_2.js');

function equations_level_3 (max) {

    const coeff_1 = nonzeroNumber(1, max);
    const coeff_2 = nonzeroNumber(1, max);
    const coeff_3 = nonzeroNumber(1, max);
    const coeff_4 = nonzeroNumber(1, max);
    const coeff_5 = nonzeroNumber(1, max);
    const coeff_6 = nonzeroNumber(1, max);
    const coeff_7 = nonzeroNumber(1, max);
    const coeff_8 = nonzeroNumber(1, max);

    // max value generated is the number of questions designed
    const rng = randomNumber(1,2); // 3 is too difficult 

    let answer;
    let question;

    let infinite = 0;

    // if you add or remove questions, update the infinite checker script in the local equations folder *******

    if (rng === 1) { // A+B(C+DX) = EX + F, solve for C, x = coeff_1, E = coeff_3*coeff_5, F = coeff_6*coeff_3, A = coeff_2*coeff_3, B = coeff_3, D = coeff_4
        infinite = infinite_check(3, rng, coeff_1, coeff_2, coeff_3, coeff_4, coeff_5, coeff_6, coeff_7, coeff_8);
        answer = coeff_1;
        question = `Solve for X. ${coeff_2*coeff_3} + ${coeff_3}( ${coeff_5*coeff_1 +coeff_6 - coeff_2 - coeff_4*coeff_1} + ${coeff_4}X) = ${coeff_5*coeff_3}X + ${coeff_6*coeff_3}`;
    } else if (rng === 2) { // A+BX = C(D+EX), solve for D, A = coeff_2*coeff_4, B = coeff_3*coeff_4, C = coeff_4, E = coeff_5
        infinite = infinite_check(3, rng, coeff_1, coeff_2, coeff_3, coeff_4, coeff_5, coeff_6, coeff_7, coeff_8);
        answer = coeff_1;
        question = `Solve for X. ${coeff_2*coeff_4} + ${coeff_3*coeff_4}X = ${coeff_4}(${coeff_2+coeff_3*coeff_1 - coeff_5*coeff_1} + ${coeff_5}X)`;
    } else if (rng === 3) { // A + B(C+DX) = E + F(G+HX), solve for C, A = coeff_2*coeff_3, B = coeff_3, D = coeff_4, E = coeff_5*coef_3, F = coeff_6*coeff_3, G = coeff_7*coeff_3, H = coeff_8*coeff_3
        answer = coeff_1;
        question = `Solve for X. ${coeff_2*coeff_3} + ${coeff_3}(${coeff_5-coeff_2 + coeff_6*(coeff_7 + coeff_8*coeff_1) - coeff_4*coeff_1} + ${coeff_4}X) = ${coeff_5*coeff_3} + ${coeff_6*coeff_3}(${coeff_7*coeff_3} + ${coeff_8*coeff_3}X)`;
    }

    return {
        question: question,
        answer: answer,
        infinite: infinite,
    }

}

module.exports = equations_level_3;
