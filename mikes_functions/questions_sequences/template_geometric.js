const geometric = require('./sequences_levels/function_geometric.js');

function geometric_sequence_template (questions) {

    const questions_array = [];
    const solutions_array = [];
    
    for (i = 1; i <= questions; i++) {

        const {question, answer} = geometric ();

        questions_array.push(question);
        solutions_array.push(answer);
    }

    return {
        questions: questions_array,
        answers: solutions_array,
    };

}

module.exports = geometric_sequence_template;