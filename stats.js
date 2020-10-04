function stats (userResponseTimes, answerResults, questions) {

    // userResponseTimes self explanatory
    // answerResults is an array of 1's (right) and 0's (wrong)

    const reducer = (sum, current) => sum + current;

    let sum_time = 0; // cumulative time spent answering question

    for (let i = 0; i < userResponseTimes.length; i++) {
        sum_time = sum_time + userResponseTimes[i];
    }

    let sum_correct = 0; // numbers of questions answered correctly

    for (let i = 0; i < answerResults.length; i++) {
        sum_correct = sum_correct + answerResults[i];
    }

    let errors = []; // list of questions you got wrong

    for (let i = 0; i < answerResults.length; i++) {
        if (answerResults[i] == 0){
            errors.push(questions[i]);
        }
    }

    // create the average time for the beginning, middle and end splits

    const split_1 = [];
    const split_2 = [];
    const split_3 = [];

    for(let i = 0; i < Math.round(0.25*userResponseTimes.length); i++) {
        split_1.push(userResponseTimes[i]);
    }

    const split_1_sum = split_1.reduce(reducer);

    for(let i = Math.round(0.25*userResponseTimes.length); i < Math.round(0.75*userResponseTimes.length) && i >= Math.round(0.25*userResponseTimes.length); i++) {
        split_2.push(userResponseTimes[i]);
    }

    const split_2_sum = split_2.reduce(reducer);

    for(let i = Math.round(0.75*userResponseTimes.length); i < userResponseTimes.length; i++){
        split_3.push(userResponseTimes[i]);
    }

    const split_3_sum = split_3.reduce(reducer);

    const average = sum_time/userResponseTimes.length;
    const fastest = Math.min(...userResponseTimes);
    const slowest = Math.max(...userResponseTimes);
    const correct = sum_correct;
    const accuracy = sum_correct/userResponseTimes.length;
    const wrong = errors;
    const split_1_avg = split_1_sum / split_1.length;
    const split_2_avg = split_2_sum / split_2.length;
    const split_3_avg = split_3_sum / split_3.length;

    // console.log(`Your average speed per question is ${average} seconds`,
    //             `Your fastest question took ${fastest} seconds`,
    //             `Your slowest question took ${slowest} seconds`,
    //             `The number of questions your got correct were ${correct}`,
    //             `Your accuracy is ${accuracy*100} %`,
    //             `The questions you got wrong were: ${wrong}`,
    //             `The average time spent at the start was ${split_1_avg}`,
    //             `The average time spent in the middle was ${split_2_avg}`,
    //             `The average time spent at the end was ${split_3_avg}`
    //             )

    console.log(average,fastest,slowest, correct, accuracy, wrong, split_1_avg, split_2_avg, split_3_avg);

}

const times = [0.7, 0.8, 0.6, 1, 1, 0.7, 1.5, 0.88];
const answers = [1, 1, 1, 1, 1, 1, 1, 0];
const question = ["1x1","2x2","3x3","4x4","5x5","6x6","7x7","8x8"];

stats(times, answers, question);