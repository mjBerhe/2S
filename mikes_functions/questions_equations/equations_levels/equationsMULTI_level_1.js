const randomNumber = require('../../global_functions/function_number_generator.js');
const nonzeroNumber = require('../../global_functions/function_number_generator_nonzero.js');

function equations_multi_level_1 (max) {

    const coeff_1 = nonzeroNumber(1, max);
    const coeff_2 = nonzeroNumber(1, max);
    const coeff_3 = nonzeroNumber(1, max);
    const coeff_4 = nonzeroNumber(1, max);
    const coeff_5 = nonzeroNumber(1, max);

    // max value generated is the number of questions designed
    const rng = randomNumber(1,4);

    let question;
    let x_value;
    let y_value;
    let z_value;

    if (rng === 1) { // X = #, Y = AX + B + X/C
        x_value = coeff_1*coeff_4;
        y_value = coeff_2*coeff_1*coeff_4 + coeff_3 + coeff_1;
        question = `X = ${coeff_1*coeff_4}. Y = ${coeff_2}*X + ${coeff_3} + X/${coeff_4}.`;
    } else if (rng === 2) { // X = #. Y = #. Z = AX + BY + C
        x_value = coeff_1;
        y_value = coeff_2;
        z_value = coeff_1*coeff_3 + coeff_2*coeff_4 + coeff_5;
        question = `X = ${coeff_1}. Y = ${coeff_2}. Z = ${coeff_3}X + ${coeff_4}Y + ${coeff_5}.`
    } else if (rng === 3) { // X = #. Y = AX + B
        x_value = coeff_1;
        y_value = coeff_1*coeff_2 + coeff_3; 
        question = `X = ${coeff_1}. Y = ${coeff_2}X + ${coeff_3}.`;
    } else if (rng === 4) { // X = #. Y = #. Z = AXY + B
        x_value = coeff_1;
        y_value = coeff_2;
        z_value = coeff_1*coeff_2*coeff_3 + coeff_4;
        question = `X = ${coeff_1}. Y = ${coeff_2}. Z = ${coeff_3}XY + ${coeff_4}.`;
    } 

    return {
        question: question,
        x_value: x_value,
        y_value: y_value,
        z_value: z_value,
    }

}

module.exports = equations_multi_level_1;