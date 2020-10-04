const randomNumber = require('./function_number_generator.js');

function geometric (level) {

    // input: level
    // output: terms

    // question types:
    // A: is this a geometric sequences? if so, enter the ratio
    // B: given the initial value and the ratio, find the sum of the next 3 terms
    // C: give them the first 2 terms + say it's geometric. find the nth term
    // D: 

    // what are we multiplying/dividing by?
    let pattern;

    // terms in the pattern that will be a given
    let first;
    let second;
    let third;
    let fourth;

    // what term are they solving for? used for level 1 and 2, and the "starting point" for level 3
    let term;

    // how many terms used in the final answer? used for level 3 only
    let terms;

    // for level 3 problems, is our answer adding terms or averaging?
    let rng;

    // output for the solution
    let answer;

    if (level === 1) {

        // not allowing a pattern of 0 or 1
        pattern = randomNumber(2,4) * Math.pow(-1,randomNumber(0,1));
        first = randomNumber(2,4) * Math.pow(-1,randomNumber(0,1));

        second = first * pattern;

        // find a term that ranges between the 4th and 6th (requires them to multiply up to 10*10)
        term = randomNumber(2,4) + 2;

        answer = first * Math.pow(pattern,(term-1)) ;
    }

    if (level === 2) {

        pattern = randomNumber(2,5) * Math.pow(-1,randomNumber(0,1));
        first = randomNumber(-100,100);

        second = first + pattern;
        third = second + pattern;
        fourth = third + pattern;

        // find a term that ranges between the 20th and 100th (requires them to multiply up from 2*20 to 5*100)
        term = randomNumber(16,100) + 4;

        answer = first + pattern * (term-1);
    }

    if (level === 3) {

        pattern = randomNumber(2,5) * Math.pow(-1,randomNumber(0,1));
        first = randomNumber(-100,100);

        second = first + pattern;
        third = second + pattern;
        fourth = third + pattern;

        // find a term that ranges between the 20th and 50th 
        term = randomNumber(16,46) + 4;

        // 0 for adding, 1 for averaging
        rng = randomNumber(0,1);

        // how many terms?
        terms = randomNumber(2,5)

        if (rng === 0) {answer = terms * (first + pattern * (term-1) + pattern * (0.5*terms - 0.5))} ;
        if (rng === 1) {answer = first + pattern * (term-1) + pattern * (0.5*terms - 0.5)} ;
    }

    console.log(pattern, first, second, term, rng, terms, answer);

}

 geometric(1)
// geometric(2)
// geometric(3)