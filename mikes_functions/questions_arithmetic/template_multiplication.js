const multiplication_level_1 = require('./multiplication_levels/multiplication_level_1.js');
const multiplication_level_2 = require('./multiplication_levels/multiplication_level_2.js');
const multiplication_level_3 = require('./multiplication_levels/multiplication_level_3.js');

module.exports = function multiplication_template (questions, level, min, max) {

    // level 1: 2 terms
    // level 2: 3 terms
    // level 3: 4 terms

    const questions_array = [];
    const solutions_array = [];
    
    for (i = 1; i <= questions; i++) {
        
        if (level === 1) {

        const {question, answer} = multiplication_level_1 (min, max);

        questions_array.push(question);
        solutions_array.push(answer);

        }

        if (level === 2) {

            const {question, answer} = multiplication_level_2 (min, max);

        questions_array.push(question);
        solutions_array.push(answer);
    
        }

        if (level === 3) {

            const {question, answer} = multiplication_level_3 (min, max);

        questions_array.push(question);
        solutions_array.push(answer);
        
        }

    }

    return {
        questions_array: questions_array,
        answers: solutions_array,
    };

}