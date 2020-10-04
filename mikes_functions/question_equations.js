const alpha_beta_solve = require('./function_equation_alphabeta.js');
const function_infinite_check = require('./function_infinite_check.js');

module.exports = function equations (questions, num, difficulty) {

    // add equations like: x/A + B = C
    // add equations like: Aw + Bx + cz = 6, w = 5, z = 3, find x
    // add cross multiply equations: 2/5 = (x+1)/ 4

    // questions: number of questions generated {all values}
    // num: number of equations to solve {1, 2}
    // difficulty: determines the range of questions generated - "levels" {1, 2, 3}
    //  - difficulty 1: 80% level 1, 20% level 2 
    //  - difficulty 2: 30% level 1, 50% level 2, 20% level 3
    //  - difficulty 3: 00% level 1, 20% level 2, 50% level 3
    //  - the above is only when num = 1. for num = 2, it's 100% their own level i.e. num = 2, difficulty = 2 => 100% level 2 questions

    // create the arrays to be returned to the server
    const string = []; 
    const solution = [];

    // create the "answer" for num = 2 questions since only one output asked for when the solution is (x,y). for num = 1, the answer is the x-value
    let answer;

    // create an identifier for the level of questions generated when num = 1 
    // remember that questions for num = 1 have different levels in each difficulty
    let level;

    // uses the outputs of the alpha_beta_solve function to identify if the 2 equations have infinite solutions
    // only used in the num = 2 loop
    let infinite;

    // *** GENERATE QUESTIONS BELOW ***

    // if num = 1, we only use the x-coordinate as our solution. no need to use the "answer variable"
    if (num === 1) {

        for (i = 1; i <= questions; i++) {

            // determine what level the question is 
            if(difficulty === 1 && i <= 0.8*questions) {level = 1} ;
            if(difficulty === 1 && i >  0.8*questions) {level = 2} ;
            if(difficulty === 2 && i <= 0.2*questions) {level = 1} ;
            if(difficulty === 2 && i >  0.2*questions && i <= 0.8*questions) {level = 2} ;
            if(difficulty === 2 && i > 0.8*questions) {level = 3} ;
            if(difficulty === 3 && i <= 0.6*questions) {level = 2} ;
            if(difficulty === 3 && i <= 0.4*questions) {level = 3} ;

            // finds alpha (for num = 1) so all coefficients in the final equation is an integer
            // note that (x_d_value,y_d_value) are generated to be from a smaller range for more difficult questions so the coefficient solved for isnt massive
            // see function_equation_alphabeta for details
            // coeffs 1-3 are used for easier levels (num = 1 + difficulty 1-2 AND num = 2 + difficulty 1). 4-7 are used for the rest. coincide with the (x_d_value, y_d_value) use
            const {
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
            } = alpha_beta_solve(num, level);

            // if difficulty is selected to be 1, generate questions. 80% level 1, 20% level 2 questions
            if (difficulty === 1) {

                // setting how many level 1 questions are asked when difficulty 1 is chosen
                if (i <= 0.8 * questions) {

                    // calculated the A in A = B*X + C so it's forced to be an integer number
                    string.push(`${alpha} = ${coeff_1}*X + ${coeff_2}`);
                    solution.push(x_value);
                }

                else {

                    // push the equation and solution into their respective arrays
                    if (rng === 1) {string.push(`${alpha} + ${coeff_1}*X = ${coeff_2}*X + ${coeff_3}`)};
                    if (rng === 2) {string.push(`${alpha} + ${coeff_1} = ${coeff_2}*X + ${coeff_3}*X`)};
                    if (rng === 3) {string.push(`${alpha} + ${coeff_1} + ${coeff_2}*X = ${coeff_3}*X`)};
                    if (rng === 4) {string.push(`${alpha} + ${coeff_1} + ${coeff_2}*X + ${coeff_3}*X = 0`)};
                    solution.push(x_value);
                }

            }

            // if difficulty is selected to be 2, generate questions. 20% level 1, 60% level 2, 20% level 3   
            else if (difficulty === 2) {

                if (i <= 0.2 * questions) {

                    // calculated the A in A = B*X + C so it's forced to be an integer number
                    string.push(`${alpha} = ${coeff_1}*X + ${coeff_2}`);
                    solution.push(x_value);
                }

                else if (i <= 0.8 * questions) {

                    if (rng === 1) {string.push(`${alpha} + ${coeff_1}*X = ${coeff_2}*X + ${coeff_3}`)};
                    if (rng === 2) {string.push(`${alpha} + ${coeff_1} = ${coeff_2}*X + ${coeff_3}*X`)};
                    if (rng === 3) {string.push(`${alpha} + ${coeff_1} + ${coeff_2}*X = ${coeff_3}*X`)};
                    if (rng === 4) {string.push(`${alpha} + ${coeff_1} + ${coeff_2}*X + ${coeff_3}*X = 0`)};
                    solution.push(x_value);
                }

                else {

                    if(rng <= 2) {string.push(`${alpha} + ${coeff_4}(${coeff_5} + ${coeff_6}*X) = ${coeff_7}`)};
                    if(rng > 2) {string.push(`${alpha} + ${coeff_4}(${coeff_5} + ${coeff_6}*X) = ${coeff_7}*X`)};
                    solution.push(x_value);
                }

            }

            // if difficulty is selected to be 3, generate questions. difficulty 3: 60% level 2, 40% level 3
            else {

                if (i <= 0.6 * questions) {

                    // note that x_d_value is used here as the solution
                    if (rng === 1) {string.push(`${alpha} + ${coeff_1}*X = ${coeff_2}*X + ${coeff_3}`)};
                    if (rng === 2) {string.push(`${alpha} + ${coeff_1} = ${coeff_2}*X + ${coeff_3}*X`)};
                    if (rng === 3) {string.push(`${alpha} + ${coeff_1} + ${coeff_2}*X = ${coeff_3}*X`)};
                    if (rng === 4) {string.push(`${alpha} + ${coeff_1} + ${coeff_2}*X + ${coeff_3}*X = 0`)};
                    solution.push(x_d_value);
                }

                else {

                    if(rng <= 2) {string.push(`${alpha} + ${coeff_4}(${coeff_5} + ${coeff_6}*X) = ${coeff_7}`)};
                    if(rng > 2) {string.push(`${alpha} + ${coeff_4}(${coeff_5} + ${coeff_6}*X) = ${coeff_7}*X`)};
                    solution.push(x_d_value);
                }

            }

        }

    }

    if (num === 2) {

        for (i = 1; i <= questions; i++) {

            const {
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
            } = alpha_beta_solve(num, difficulty);

            // checks if the solutions from these equations can be inf many
            infinite = function_infinite_check(2, rng, alpha, beta, coeff_4, coeff_5, coeff_6, coeff_7) ;

            // define the solution for each difficulty
            // we can change "." as a solution when there are Inf many
            if (infinite === false) {
                if (difficulty === 1) {answer = Math.max(x_value,y_value)} ;
                if (difficulty === 2) {answer = x_d_value + y_d_value} ;
                if (difficulty === 3) {answer = x_d_value * y_d_value} ;
            } else {answer = "."}

            if (difficulty === 1) {

                if(rng <= 2) {string.push(`Y = X + ${alpha} AND Y = ${coeff_1}*X + ${beta}. Find the max of x and y`)} ; // Y = X + A, Y = CX + B
                if(rng > 2) {string.push(`Y = ${coeff_1}*X + ${alpha} AND Y = ${coeff_2}*X + ${beta}. Find the max of x and y`)} ; // Y = CX + A, Y = DX + B
                solution.push(answer);
            }

            else if (difficulty === 2) {

                if(rng <= 2) {string.push(`Y = ${coeff_4}*X + ${alpha} AND ${coeff_5}*Y = ${coeff_6}*X + ${beta}. Find the sum of x and y`)} ; // Y = CX + A, DY = EX + B
                if(rng > 2) {string.push(`${alpha} + ${coeff_4}*Y = ${coeff_5}*X AND ${coeff_6}*X + ${beta} = ${coeff_7}*Y. Find the sum of x and y`)} ; // A + CY = DX, EX + B = FY
                solution.push(answer);
            }

            else if (difficulty === 3) {  

                if(rng <= 2) {string.push(`${coeff_4}*X + ${coeff_5}*Y + ${alpha} = 0 AND ${coeff_6}*Y + ${coeff_7}*X + ${beta} = 0. Find the product of x and y`)} ; // CX + DY + A = 0, EY + FX + B = 0
                if(rng > 2) {string.push(`${coeff_4}*Y = ${coeff_5}*X + ${alpha}  AND ${coeff_6}*Y = ${coeff_7}*X + ${beta}. Find the product of x and y`)} ; // CY = DX + A, EY = FX + B
                solution.push(answer);
            }
        }
    }

    // console.log(string, solution);
    return {
        questions: string, 
        answers: solution,
    };

}

// equations(10,1,1)
// equations(10,1,2)
// equations(10,1,3)
// equations(10,2,1)
// equations(10,2,2)
// equations(10,2,3)
