const randomNumber = require('../../global_functions/function_number_generator.js');

function additive () {

    // input: level
    // output: terms 

    // what are we adding/subtracting by?
    let pattern = randomNumber(-5,5);
    let pattern_p = randomNumber(1,5);

    // first term
    let first = randomNumber(-10,10);

    // what term are they solving for?
    let term = randomNumber(10,20);

    // what term are they given?
    let given = randomNumber(10,20);

    // harder starting point
    let start_hard = randomNumber(100,110);

    // generates a different type of problem
    const rng = randomNumber(1,7);

    // output for the solution and answer
    let answer, question;

    if (rng === 1) {

        question = `Find the common difference in the sequence: ${first}, ${first+pattern}, ${first+pattern*2}.`;
        answer = pattern;
    }

    if (rng === 2) {

        question = `Find the ${term}th term if the first 3 values in an additive sequence are: ${first}, ${first+pattern}, ${first+pattern*2}.`
        answer = first + pattern * (term - 1);
    }

    if (rng === 3) {

        question = `Given that the ${given}th and ${given+1}th terms in an additive sequence are ${first +(given-1)*pattern} and ${first + given*pattern}, find the first term.`
        answer = first;
        
    }

    if (rng === 4) {

        question = `Given that the ${given}th and ${given+1}th terms in an additive sequence are ${first +(given-1)*pattern} and ${first + given*pattern}, find the 50th term.`
        answer = first + 49*pattern;
    }

    if (rng === 5) {

        question = `The first 3 terms of a sequence are: ${first}, ${first + pattern_p}, ${first + pattern_p * 2}. Which term does the sequence first surpass 100?`
        answer = Math.floor((100-first)/pattern_p +1);
    }

    if (rng === 6) {

        rngtemp_1 = randomNumber(0,1);
        rngtemp_2 = randomNumber(0,1);
        question = `Is the following sequence arithmetic? ${first}, ${first + pattern}, ${first+pattern*2}, ${first +pattern*3 + Math.pow(-1,rngtemp_1) + Math.pow(-1,rngtemp_2)}`
        if (rngtemp_1 + rngtemp_2 === 1) {answer = 1} else {answer = 0};
    }

    if (rng === 7) {

        question = `Find the common difference in the sequence: ${start_hard}, ${start_hard+pattern}, ${start_hard+pattern*2}.`;
        answer = pattern;
    }

    // console.log(question, answer);

    return {
        question: question,
        answer: answer,
    }

}

module.exports = additive;