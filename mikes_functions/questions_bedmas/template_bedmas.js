const bedmas_level_1 = require('./bedmas_levels/bedmas_level_1.js');
const bedmas_level_2 = require('./bedmas_levels/bedmas_level_2.js');
const bedmas_level_3 = require('./bedmas_levels/bedmas_level_3.js');

function bedmas_template (questions, level, min, max) {

    // think of this as multiplication, where min and max are generating the divisor and the quotient 
    // level 1: 2 terms 
    // level 2: 3 terms
    // level 3: 4 terms

    const questions_array = [];
    const solutions_array = [];
    
    for (i = 1; i <= questions; i++) {
        
        if (level === 1) { 

        const {question, answer} = bedmas_level_1 (min, max);

        questions_array.push(question);
        solutions_array.push(answer);

        }

        if (level === 2) {

            const {question, answer} = bedmas_level_2 (min, max);

        questions_array.push(question);
        solutions_array.push(answer);
    
        }

        if (level === 3) {

            const {question, answer} = bedmas_level_3 (min, max);

        questions_array.push(question);
        solutions_array.push(answer);
        
        }

    }

    return {
        questions: questions_array,
        answers: solutions_array,
    };

}

module.exports = bedmas_template;