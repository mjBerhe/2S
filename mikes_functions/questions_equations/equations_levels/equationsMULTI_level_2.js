const randomNumber = require('../../global_functions/function_number_generator.js');
const nonzeroNumber = require('../../global_functions/function_number_generator_nonzero.js');
const infinite_check_2 = require('../local_equations/infinite_checker_two_eq.js');

function equations_multi_level_2 (max) {

    const coeff_1 = nonzeroNumber(1, max);
    const coeff_2 = nonzeroNumber(1, max);
    const coeff_3 = nonzeroNumber(1, max);
    const coeff_4 = nonzeroNumber(1, max);
    const coeff_5 = nonzeroNumber(1, max);
    const coeff_6 = nonzeroNumber(1, max);

    // max value generated is the number of questions designed
    const rng = randomNumber(1,3);

    let question;
    let x_value;
    let y_value;
    let z_value;
    let infinite = 0;

    if (rng === 1) { // X = #, Y = AX + B. Z = CY + D
        x_value = coeff_1;
        y_value = coeff_2*coeff_1 + coeff_3;
        z_value = y_value*coeff_4 + coeff_5;
        question = `X = ${coeff_1}. Y = ${coeff_2}*X + ${coeff_3}. Z = ${coeff_4}Y + ${coeff_5}.`;
    } else if (rng === 2) { // X = #. Y = AX + B. Z = CX + DY + E
        x_value = coeff_1;
        y_value = coeff_2*coeff_1 + coeff_3;
        z_value = coeff_1*coeff_4 + y_value*coeff_5 + coeff_6;
        question = `X = ${coeff_1}. Y = ${coeff_2}X + ${coeff_3}. Z = ${coeff_4}X + ${coeff_5}Y + ${coeff_6}.`
    } else if (rng === 3) { // Y = AX + B. Y = CX + D
        infinite = infinite_check_2(2, 3, coeff_1, coeff_2, coeff_3, coeff_4, coeff_5, coeff_6, 0, 0);
        x_value = coeff_1;
        y_value = coeff_2;
        question = `Y = ${coeff_3}X + ${coeff_2 - coeff_3*coeff_1}. Y = ${coeff_4}X + ${coeff_2 - coeff_1*coeff_4}.`;
    } 

    return {
        question: question,
        x_value: x_value,
        y_value: y_value,
        z_value: z_value,
        infinite: infinite,
    }

}

module.exports = equations_multi_level_2;