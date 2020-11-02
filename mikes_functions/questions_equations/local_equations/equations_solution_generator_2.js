const randomNumber = require('../../global_functions/function_number_generator.js');

function solution_generator_2coeff (x, y) {

    let rng = randomNumber(1,6);
    let question;
    let answer;

    // for T/F questions, 1 = TRUE, 0 = FALSE

    if (rng === 1) {
        question = " What is the MIN(X, Y) ?";
        answer = Math.min(x,y);
    } else if (rng === 2) {
        question = " What is the MAX(X,Y) ?";
        answer = Math.max(x,y);
    } else if (rng === 3) {
        question = " What is X + Y ?";
        answer = x + y;
    } else if (rng === 4) {
        question = " What is X - Y";
        answer = x - y;
    } else if (rng === 5) {
        question = " Is X > Y ?";
        if (x > y) {
            answer = 1;
        } else {answer = 0};
    } else if (rng === 6) {
        question = " Is Y > X ?";
        if (y > x) {
            answer = 1;
        } else {answer = 0};
    }

    return {
        question_2: question,
        answer: answer,
    }

}  

module.exports = solution_generator_2coeff;