const addition_level_1 = require('./addition_levels/addition_level_1.js');
const addition_level_2 = require('./addition_levels/addition_level_2.js');
const addition_level_3 = require('./addition_levels/addition_level_3.js');

function addition_template (questions, level, min, max) {

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

        const {terms, question, answer} = addition_level_1(min ,max);

        terms_array.push(terms);
        questions_array.push(question);
        solutions_array.push(answer);

        }

        if (level === 2) {

            const {terms, question, answer} = addition_level_2(min ,max);

            terms_array.push(terms);
            questions_array.push(question);
            solutions_array.push(answer);
    
        }

        if (level === 3) {

            const {terms, question, answer} = addition_level_3(min ,max);

        terms_array.push(terms);
        questions_array.push(question);
        solutions_array.push(answer);

        }

    }

    return {
        terms: terms_array,
        questions: questions_array,
        answers: solutions_array,
        type: "addition",
        classification: classification,
    };

}

module.exports = addition_template;