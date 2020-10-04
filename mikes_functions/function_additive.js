const randomNumber = require('./function_number_generator.js');

function additive (level) {

    // input: level
    // output: terms

    // add equations like: x/A + B = C
    // add equations like: Aw + Bx + cz = 6, w = 5, z = 3, find x

    // A: is this an arithmetic sequences? if so, enter the pattern
    // B: given the initial value and the pattern, find the sum of the next 3 terms
    // C: give them the first 2 terms + say it's arithmetic. find the nth term
    // D: given the nth and (n+1)th term, find the first term, n = anything
    // E: harder version of D is to give the nth and (n+m)th term
    // F: find x given the sequences is arithmetic: k, 3k, 20-k !!! or k, 8+k, 9k  

    // what are we adding/subtracting by?
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
        pattern = randomNumber(2,10) * Math.pow(-1,randomNumber(0,1));
        first = randomNumber(-10,10);

        second = first + pattern;
        third = second + pattern;
        fourth = third + pattern;

        // find a term that ranges between the fifth and 14th (requires them to multiply up to 10*10)
        term = randomNumber(1,10) + 4;

        answer = first + pattern * (term-1) ;
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

    // console.log(pattern, first, second, third, fourth, term, rng, terms, answer);

    return {
        first: first,
        second: second,
        third: third,
        fourth: fourth,
        term: term,
        rng: rng,
        terms: terms,
        answer: answer,
    }

}

// additive(1)
// additive(2)
// additive(3)