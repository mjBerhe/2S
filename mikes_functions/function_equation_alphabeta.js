const randomNumber = require('./function_number_generator.js');

module.exports = function alpha_beta_solve (num, difficulty) {

    let alpha;
    let beta;

    // bounds on the coordinates (or just the X if num = 1) on our solutions. if num = 2, solution will be X ~ Y, where ~ is any operation
    const min_solution = -10; 
    const max_solution = 10; 

    const min_d_solution = -5; 
    const max_d_solution = 5; 

    // it's possible for coefficients to be higher than max and lower than min. just for our purposes of generating coefficients
    const min_coefficient = 2; 
    const max_cofficient = 10; 
    const max_d_coefficient = 5; 

    // generate necessary arrays
    const x_value = randomNumber(min_solution, max_solution);
    const y_value = randomNumber(min_solution, max_solution);

    const x_d_value = randomNumber(min_d_solution, max_d_solution);
    const y_d_value = randomNumber(min_d_solution, max_d_solution);

    const rng = randomNumber(1, 4);
    const coeff_1 = randomNumber(min_coefficient, max_cofficient);
    const coeff_2 = randomNumber(min_coefficient, max_cofficient);
    const coeff_3 = randomNumber(min_coefficient, max_cofficient);

    // coefficients used for the difficult questions
    const coeff_4 = randomNumber(min_coefficient, max_d_coefficient);
    const coeff_5 = randomNumber(min_coefficient, max_d_coefficient);
    const coeff_6 = randomNumber(min_coefficient, max_d_coefficient);
    const coeff_7 = randomNumber(min_coefficient, max_d_coefficient);

    if (num === 1) {

        if (difficulty === 1) {

            alpha = coeff_1 * x_value + coeff_2; // A = BX + C
        } 

        if (difficulty === 2) {

            if (rng === 1) { alpha = (coeff_2 - coeff_1) * x_value + coeff_3 } ; // A + BX = CX + D
            if (rng === 2) { alpha = (coeff_2 + coeff_3) * x_value - coeff_1 } ; // A + B = CX + DX
            if (rng === 3) { alpha = (coeff_3 - coeff_2) * x_value - coeff_1 } ; // A + B + CX = DX
            if (rng === 4) { alpha = -(coeff_2 + coeff_3) * x_value - coeff_1 } ; // A + B + CX + DX = 0
        }

        if (difficulty === 3) {

            if (rng <= 2) { alpha = coeff_7 - coeff_4 * (coeff_5 + coeff_6 * x_d_value )} ; // A + B(C + DX) = E
            if (rng > 2) { alpha = coeff_7 * x_d_value - coeff_4 * (coeff_5 + coeff_6 * x_d_value )} ; // A + B(C + DX) = EX
        }

    }

    if (num === 2) {

        if (difficulty === 1) {

            if(rng <= 2) {
                
                // Y = X + A, Y = CX + B
                alpha = y_value - x_value;
                beta = y_value - coeff_1 * x_value;
            } 

            if(rng > 2) {
                
                // Y = CX + A, Y = DX + B
                alpha = y_value - coeff_1 * x_value;
                beta = y_value - coeff_2 * x_value;
            } 
        }

        else if (difficulty === 2) {

            if(rng <= 2) {
                
                // CY = DX + A, EY = FX + B
                alpha = coeff_4 * y_d_value - coeff_5 * x_d_value;
                beta = coeff_6 * y_d_value - coeff_7 * x_d_value;
            }

            if(rng > 2) { 

                // A + CY = DX, EX + B = FY
                alpha = coeff_5 * x_d_value - coeff_4 * y_d_value;
                beta = coeff_7 * y_d_value - coeff_6 * x_d_value;   
            } 
        }
 
        else if (difficulty === 3) {

            if(rng <= 2) {

                // CX + DY + A = 0, EY + FX + B = 0
                alpha = -(coeff_4 * x_d_value + coeff_5 * y_d_value);
                beta = -(coeff_6 * y_d_value - coeff_7 * x_d_value);  
            }

            if(rng > 2) {

                // CY = DX + A, EY = FX + B
                alpha = coeff_4 * y_d_value - coeff_5 * x_d_value;
                beta = coeff_6 * y_d_value - coeff_7 * x_d_value;
            }
           
        }

    }

    //console.log(alpha, x_value, y_value, coeff_1, coeff_2, coeff_3, coeff_4);

    return {
        alpha: alpha,
        beta: beta,
        x_value: x_value,
        y_value: y_value,
        x_d_value: x_d_value,
        y_d_value: y_d_value,  
        rng: rng,
        coeff_1: coeff_1, 
        coeff_2: coeff_2, 
        coeff_3: coeff_3,
        coeff_4: coeff_4,
        coeff_5: coeff_5,
        coeff_6: coeff_6,
        coeff_7: coeff_7,
    }
   
}


// const {
//     alpha: alpha,
//     x_value: x_value,
//     y_value: y_value, 
//     rng: rng,
//     coeff_1: coeff_1, 
//     coeff_2: coeff_2, 
//     coeff_3: coeff_3,
//     coeff_4: coeff_4
// } = alpha_solve(1, 1);

// console.log(alpha, x_value)