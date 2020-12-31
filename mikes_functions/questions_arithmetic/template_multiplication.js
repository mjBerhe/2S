const multiplication_level_1 = require('./multiplication_levels/multiplication_level_1.js');
const multiplication_level_2 = require('./multiplication_levels/multiplication_level_2.js');
const multiplication_level_3 = require('./multiplication_levels/multiplication_level_3.js');

function multiplication_template (questions, level, min, max) {

    // level 1: 2 terms
    // level 2: 3 terms
    // level 3: 4 terms

    const terms_array = [];
    const questions_array = [];
    const solutions_array = [];
    const classification = 1;

    if (level > 2) {classification = 2};
    
    for (i = 1; i <= questions; i++) {
        
        if (level === 1) {

            const {terms, question, answer} = multiplication_level_1 (min, max);

            terms_array.push(terms);
            questions_array.push(question);
            solutions_array.push(answer);

        }

        if (level === 2) {

            const {terms, question, answer} = multiplication_level_2 (min, max);

            terms_array.push(terms);
            questions_array.push(question);
            solutions_array.push(answer);
    
        }

        if (level === 3) {

            const {terms, question, answer} = multiplication_level_3 (min, max);

            terms_array.push(terms);
            questions_array.push(question);
            solutions_array.push(answer);
        
        }

    }

    return {
        terms: terms_array,
        questions: questions_array,
        answers: solutions_array,
        type: 3,
        classification: classification,
        level = level,
    };

}

module.exports = multiplication_template;