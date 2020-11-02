const subtraction_level_1 = require('./subtraction_levels/subtraction_level_1.js');
const subtraction_level_2 = require('./subtraction_levels/subtraction_level_2.js');
const subtraction_level_3 = require('./subtraction_levels/subtraction_level_3.js');

module.exports = function subtraction_template (questions, level, min, max) {

    // level 1: 2 terms
    // level 2: 3 terms, each subsequent term is smaller than the previous. can dip into negatives i.e. if min = 0, max = 50: potential question = 35 - 21 - 20 < 0, where 35 > 21 > 20
    // level 3: 4 terms, each term truly ranges from min to max i.e. if min = 0, max = 50: potential question = 40 - 18 - 27 - 50 < 0

    const questions_array = [];
    const solutions_array = [];
    
    for (i = 1; i <= questions; i++) {
        
        if (level === 1) {

        const {question, answer} = subtraction_level_1 (min, max);

        questions_array.push(question);
        solutions_array.push(answer);

        }

        if (level === 2) {

            const {question, answer} = subtraction_level_2 (min, max);

        questions_array.push(question);
        solutions_array.push(answer);
    
        }

        if (level === 3) {

            const {question, answer} = subtraction_level_3 (min, max);

        questions_array.push(question);
        solutions_array.push(answer);
        
        }

    }

    return {
        questions_array: questions_array,
        answers: solutions_array,
    };

}