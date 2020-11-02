const additive = require('./sequences_levels/function_additive.js');

function additive_sequence_template (questions) {

    const questions_array = [];
    const solutions_array = [];
    
    for (i = 1; i <= questions; i++) {

        const {question, answer} = additive ();

        questions_array.push(question);
        solutions_array.push(answer);
    }

    return {
        questions: questions_array,
        answers: solutions_array,
    };

}

module.exports = additive_sequence_template;