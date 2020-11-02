const randomNumber = require('../../global_functions/function_number_generator.js');

function solution_generator_3coeff (x, y, z) {

    let rng = randomNumber(1,6);
    let question;
    let answer = 0;

    // for T/F questions, 1 = TRUE, 0 = FALSE

    if (rng === 1) {
        question = " What is the MIN(X,Y,Z) ?";
        answer = Math.min(x,y,z);
    } else if (rng === 2) {
        question = " What is the MAX(X,Y,Z) ?";
        answer = Math.max(x,y,z);
    } else if (rng === 3) {
        question = " What is X + Y + Z ?";
        answer = x + y + z;
    } else if (rng === 4) {
        question = " What is X - Y + Z";
        answer = x - y + z;
    } else if (rng === 5) {
        question = " Are X, Y, Z > 0 ?";
        if (x > 0 && y > 0 && z > 0) {answer = 1};
    } else if (rng === 6) {
        question = " Are X, Y, Z < 0 ?";
        if (x < 0 && y < 0 && z < 0) {answer = 1};
    }

    return {
        question_2: question,
        answer: answer,
    }

}  

module.exports = solution_generator_3coeff;