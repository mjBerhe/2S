const randomNumber = require('../../global_functions/function_number_generator.js');
const nonzeroNumber = require('../../global_functions/function_number_generator_nonzero.js');

function equations_level_1 (max) {

    const coeff_1 = nonzeroNumber(1, max);
    const coeff_2 = nonzeroNumber(1, max);

    // max value generated is the number of questions designed
    const rng = randomNumber(1,4);

    let answer;
    let question;

    if (rng === 1) { // X/A = B
        answer = coeff_1 * coeff_2;
        question = `Solve for X. X / ${coeff_1} = ${coeff_2}`;
    } else if (rng === 2) { // X+A = B
        answer = coeff_2 - coeff_1;
        question = `Solve for X. X + ${coeff_1} = ${coeff_2}`
    } else if (rng === 3) { // X*A = B
        answer = coeff_1 * coeff_2 / coeff_2;
        question = `Solve for X. X * ${coeff_2} = ${coeff_1*coeff_2} ?`;
    } else if (rng === 4) { // A/X = B 
        answer = coeff_1;
        question = `Solve for X. ${coeff_1*coeff_2} / X = ${coeff_2} ?`;
    }

    return {
        question: question,
        answer: answer,
    }

}

module.exports = equations_level_1;