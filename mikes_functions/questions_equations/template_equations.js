const equationsONE_level_1 = require('./equations_levels/equationsONE_level_1.js');
const equationsONE_level_2 = require('./equations_levels/equationsONE_level_2.js');
const equationsONE_level_3 = require('./equations_levels/equationsONE_level_3.js');
const equationsMULTI_level_1 = require('./equations_levels/equationsMULTI_level_1.js');
const equationsMULTI_level_2 = require('./equations_levels/equationsMULTI_level_2.js');
const solution_generator_2coeff = require('./local_equations/equations_solution_generator_2.js');
const solution_generator_3coeff = require('./local_equations/equations_solution_generator_3.js');

function equations_template (questions, equations, level, max) {

    // entry for equations are either 1 or 2

    // think of this as multiplication, where min and max are generating the divisor and the quotient 
    // level 1: 2 terms 
    // level 2: 3 terms
    // level 3: 4 terms

    // max value should be 10 - dictates how large the vast majority of coefficients will be

    const questions_array = [];
    const solutions_array = [];

    // what the user must enter if the answer has infinite solutions
    const infinite_solutions = 1;
    
    for (i = 1; i <= questions; i++) {

        if (equations === 1) {
        
            if (level === 1) { 

            const {question, answer} = equationsONE_level_1 (max);

            questions_array.push(question);
            solutions_array.push(answer);

            }

            if (level === 2) {

                const {question, answer, infinite} = equationsONE_level_2 (max);

            questions_array.push(question);
            if (infinite) {
                solutions_array.push(infinite_solutions);
            } else {solutions_array.push(answer)};

            }

            if (level === 3) {

                const {question, answer, infinite} = equationsONE_level_3 (max);

            questions_array.push(question);
            if (infinite) {
                solutions_array.push(infinite_solutions);
            } else {solutions_array.push(answer)};
            
            }

        }
        
        else {

            let question_2, answer;

            if (level === 1) { 

                const {question, x_value, y_value, z_value} = equationsMULTI_level_1 (max);

                console.log(z_value);

                if (z_value == undefined) {
                     ({question_2, answer} = solution_generator_2coeff (x_value, y_value));
                } else {
                    ({question_2, answer} = solution_generator_3coeff (x_value, y_value, z_value));
                }
    
                questions_array.push(question.concat(question_2));
                solutions_array.push(answer);
    
                }
    
            if (level === 2) {
    
                const {question, x_value, y_value, z_value, infinite} = equationsMULTI_level_2 (max);
                
                if (z_value == undefined) {
                    ({question_2, answer} = solution_generator_2coeff (x_value, y_value));
               } else {
                   ({question_2, answer} = solution_generator_3coeff (x_value, y_value, z_value));
               }
    
                questions_array.push(question.concat(question_2));

                if (infinite) {
                    solutions_array.push(infinite_solutions);
                } else {solutions_array.push(answer)};
    
            }

        }

    }

    return {
        questions_array: questions_array,
        answers: solutions_array,
    }

}

module.exports = equations_template;