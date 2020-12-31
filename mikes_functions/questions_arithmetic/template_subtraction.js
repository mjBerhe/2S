const subtraction_level_1 = require('./subtraction_levels/subtraction_level_1.js');
const subtraction_level_2 = require('./subtraction_levels/subtraction_level_2.js');
const subtraction_level_3 = require('./subtraction_levels/subtraction_level_3.js');

function subtraction_template (questions, level, min, max) {

    // level 1: 2 terms
    // level 2: 3 terms, each subsequent term is smaller than the previous. can dip into negatives i.e. if min = 0, max = 50: potential question = 35 - 21 - 20 < 0, where 35 > 21 > 20
    // level 3: 4 terms, each term truly ranges from min to max i.e. if min = 0, max = 50: potential question = 40 - 18 - 27 - 50 < 0

    const terms_array = [];
    const questions_array = [];
    const solutions_array = [];
    const classification = 1;

    if (level > 2) {classification = 2};
    
    for (i = 1; i <= questions; i++) {
        
        if (level === 1) {

        const {terms, question, answer} = subtraction_level_1 (min, max);

            terms_array.push(terms);
            questions_array.push(question);
            solutions_array.push(answer);

        }

        if (level === 2) {

            const {terms, question, answer} = subtraction_level_2 (min, max);

            terms_array.push(terms);
            questions_array.push(question);
            solutions_array.push(answer);
    
        }

        if (level === 3) {

            const {terms, question, answer} = subtraction_level_3 (min, max);

            terms_array.push(terms);
            questions_array.push(question);
            solutions_array.push(answer);
        
        }

    }

    return {
        terms: terms_array,
        questions: questions_array,
        answers: solutions_array,
        type: 2,
        classification: classification,
        level: level,
    };

}

module.exports = subtraction_template;