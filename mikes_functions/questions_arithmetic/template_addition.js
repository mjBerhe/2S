const addition_level_1 = require('./addition_levels/addition_level_1.js');
const addition_level_2 = require('./addition_levels/addition_level_2.js');
const addition_level_3 = require('./addition_levels/addition_level_3.js');

module.exports = function addition_template (questions, level, min, max) {

    // level 1: 2 terms
    // level 2: 3 terms
    // level 3: 4 terms

    const questions_array = [];
    const solutions_array = [];
    
    for (i = 1; i <= questions; i++) {
        
        if (level === 1) {

        const {question, answer} = addition_level_1(min ,max);

        questions_array.push(question);
        solutions_array.push(answer);

        }

        if (level === 2) {

            const {question, answer} = addition_level_2(min ,max);

        questions_array.push(question);
        solutions_array.push(answer);
    
        }

        if (level === 3) {

            const {question, answer} = addition_level_3(min ,max);

        questions_array.push(question);
        solutions_array.push(answer);
        
        }

    }

    return {
        questions_array: questions_array,
        answers: solutions_array,
    };

}
