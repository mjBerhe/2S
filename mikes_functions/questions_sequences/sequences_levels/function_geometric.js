const randomNumber = require('../../global_functions/function_number_generator.js');

function geometric () {

    // input: level
    // output: terms

    // what are we multiplying/dividing by?
    let pattern = randomNumber(-5,5);
    let pattern_p = randomNumber(1,5);

    // first term
    let first = randomNumber(-5,5);
    let first_p = randomNumber(2,5);

    // what term are they solving for?
    let term = randomNumber(4,6);

    // what term are they given?
    let given = randomNumber(3,5);

    // harder starting point
    let start_hard = randomNumber(10,20);

    // generates a different type of problem
    const rng = randomNumber(1,6);

    // output for the solution and answer
    let answer, question;

    if (rng === 1) {

        question = `Find the scale factor in the sequence: ${first}, ${first*pattern}, ${first*Math.pow(pattern,2)}.`;
        answer = pattern;
    }

    if (rng === 2) {

        question = `Find the ${term}th term if the first 3 values in a geometric sequence are: ${first}, ${first*pattern}, ${first*Math.pow(pattern,2)}.`
        answer = first * Math.pow(pattern,term - 1);
    }

    if (rng === 3) {

        question = `Given that the ${given}th and ${given+1}th terms in a geometric sequence are ${first*Math.pow(pattern,given-1)} and ${first*Math.pow(pattern,given)}, find the first term.`
        answer = first;
    }

    if (rng === 4) {

        question = `The first 3 terms of a geometric sequence are: ${first_p}, ${first_p*Math.pow(pattern_p,1)}, ${first_p*Math.pow(pattern_p,2)}. Which term does the sequence first surpass 100?`
        answer = Math.floor(Math.log(100-first)/Math.log(pattern_p) +1);
    }

    if (rng === 5) {

        rngtemp_1 = randomNumber(0,1);
        rngtemp_2 = randomNumber(0,1);
        question = `Is the following sequence geometric? ${first}, ${first*pattern}, ${first*Math.pow(pattern,2)}, ${first*Math.pow(pattern,3) + Math.pow(-1,rngtemp_1) + Math.pow(-1,rngtemp_2)}`
        if (rngtemp_1 + rngtemp_2 === 1) {answer = 1} else {answer = 0};
    }

    if (rng === 6) {

        question = `Find the scale factor in the sequence: ${start_hard}, ${start_hard*pattern}, ${start_hard*Math.pow(pattern,2)}.`;
        answer = pattern;
    }

    return {
        question: question,
        answer: answer,
    }

}

module.exports = geometric;