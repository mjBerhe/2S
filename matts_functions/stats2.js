// FOR NOW stats function is called once everyone finishes the game
// will give the stats for each individual per round 

function statsGenerator (roundsInfo) {

   // FORMAT OF roundsInfo
   // roundsInfo: {
   //    'round 1': {
   //       answers: arrayOfAnswers,
   //       results: [{
   //          id: exampleId,
   //          name: exampleName,
   //          userAnswers: [30, 50, 22, ...],
   //          userResponseTimes: [890, 1130, 2230, ...],
   //       }, {...}, {...}, ...],
   //    },
   //    'round 2': {
   //       answers: arrayOfAnswers,
   //       results: [{
   //          id: exampleId,
   //          name: exampleName,
   //          userAnswers: [36, 52, 23, ...],
   //          userResponseTimes: [890, 1130, 2230, ...],
   //       }, {...}, {...}, ...],
   //    },
   //    ...
   // }

   const listOfRounds = Object.keys(roundsInfo); // ['round 1', 'round 2', ...]

   const stats = {};

   listOfRounds.forEach(round => {
      stats[round] = [];
   })

   // looping through each round 
   listOfRounds.forEach(round => {
      // looping through each user's results
      roundsInfo[round].results.forEach(user => {
         const {fastResponseTime, fastQuestionNum} = fastestCorrectResponse(user.userAnswers, user.userResponseTimes, roundsInfo[round].answers);
         const {slowResponseTime, slowQuestionNum} = slowestCorrectResponse(user.userAnswers, user.userResponseTimes, roundsInfo[round].answers);
         stats[round].push({
            id: user.id,
            name: user.name,
            correctResponses: totalCorrectAnswers(user.userAnswers, roundsInfo[round].answers),
            accuracy: totalCorrectAnswers(user.userAnswers, roundsInfo[round].answers)/roundsInfo[round].answers.length,
            avgResponseTime: avgResponseTime(user.userResponseTimes),
            fastestCorrectResponse: {
               questionNumber: fastQuestionNum,
               responseTime: fastResponseTime,
            },
            fastestResponse: {
               questionNumber: user.userResponseTimes.indexOf(Math.min(...user.userResponseTimes)) + 1,
               responseTime: Math.min(...user.userResponseTimes),
            },
            slowestCorrectResponse: {
               questionNumber: slowQuestionNum,
               responseTime: slowResponseTime,
            },
            slowestResponse: {
               questionNumber: user.userResponseTimes.indexOf(Math.max(...user.userResponseTimes)) + 1,
               responseTime: Math.max(...user.userResponseTimes),
            },
         });
      });
   });

   return stats;
}

module.exports = statsGenerator;

const sumReducer = (sum, curVal) => sum + curVal;

const totalCorrectAnswers = (userAnswers, correctAnswers) => {
   const correctResponses = userAnswers.filter((userAnswer, index) => {
      return userAnswer === correctAnswers[index]});
   return correctResponses.length;
}

const fastestCorrectResponse = (userAnswers, userResponseTimes, correctAnswers) => {
   const correctIndexes = [];
   const correctUserResponseTimes = [];
   userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
         correctIndexes.push(index);
      }
   });
   
   if (correctIndexes.length) {
      correctIndexes.forEach(index => {
         correctUserResponseTimes.push(userResponseTimes[index]);
      });
      const fastestResponse = Math.min(...correctUserResponseTimes);
      return {
         fastResponseTime: fastestResponse,
         fastQuestionNum: userResponseTimes.indexOf(fastestResponse) + 1,
      }
   } else {
      return {
         fastResponseTime: 0,
         fastQuestionNum: 0,
      }
   }
}

const slowestCorrectResponse = (userAnswers, userResponseTimes, correctAnswers) => {
   const correctIndexes = [];
   const correctUserResponseTimes = [];
   userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
         correctIndexes.push(index);
      }
   });
   
   if (correctIndexes.length) {
      correctIndexes.forEach(index => {
         correctUserResponseTimes.push(userResponseTimes[index]);
      });
      const slowestResponse = Math.max(...correctUserResponseTimes);
      return {
         slowResponseTime: slowestResponse,
         slowQuestionNum: userResponseTimes.indexOf(slowestResponse) + 1,
      }
   } else {
      return {
         slowResponseTime: 0,
         slowQuestionNum: 0,
      }
   }
}

const avgResponseTime = (responseTimesArray) => {
   if (responseTimesArray.length === 0) {
      return 0;
   } else {
      return responseTimesArray.reduce(sumReducer)/responseTimesArray.length;
   }
}

// const testAnswers = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
// const testRoundInfo = {
//    'round 1': {
//       answers: testAnswers,
//       results: [{
//          id: 'test_id_1',
//          name: 'test_name_1',
//          userAnswers: [11, 21, 31, 41, 51, 61, 71, 81, 91, 110],
//          userResponseTimes: [100, 101, 102, 105, 103, 105, 106, 107, 108, 109],
//       }],
//    },
//    'round 2': {
//       answers: testAnswers,
//       results: [{
//          id: 'test_id_2',
//          name: 'test_name_2',
//          userAnswers: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
//          userResponseTimes: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
//       }],
//    }
// }

// statsGenerator(testRoundInfo);