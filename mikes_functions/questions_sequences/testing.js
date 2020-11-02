const randomNumber = require('././global_functions/function_number_generator.js');
const shuffle = require('/function_shuffle.js');

function additive (level) {

    // input: level
    // output: terms

    // A: is this an arithmetic sequences? if so, enter the pattern
    // B: given the initial value and the pattern, find the sum of the next 3 terms
    // C: give them the first 2 terms + say it's arithmetic. find the nth term
    // D: given the nth and (n+1)th term, find the first term, n = anything
    // E: harder version of D is to give the nth and (n+m)th term
    // F: find x given the sequences is arithmetic: k, 3k, 20-k !!! or k, 8+k, 9k  

    // what are we adding/subtracting by?
    let pattern = randomNumber(-10,10);

    // zeroth term
    let zeroth = randomNumber(-10,10);

    // terms in the pattern that will be a given
    let first = zeroth + pattern * 1;
    let second = zeroth + pattern * 2;
    let third = zeroth + pattern * 3;
    let fourth = zeroth + pattern * 4;
    let fifth = zeroth + pattern * 5;
    let sixth = zeroth + pattern * 6;
    let seventh = zeroth + pattern * 7;
    let eigthth = zeroth + pattern * 8;
    let ninth = zeroth + pattern * 9;
    let tenth = zeroth + pattern * 10;

    let sequence_addition = [first, second, third, fourth, fifth, sixth, seventh, eigthth, ninth, tenth];

    sequence_addition = shuffle(sequence_addition);

    console.log(sequence_addition);

} 

additive(1);