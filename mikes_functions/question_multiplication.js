function multiplication(questions, max, min, terms, decimals) {

    // questions > 0
    // max and min are boundless
    // terms can be between 2 and 5
    // decimal defines how many decimals in the number

    // create the vectors for addition

    const first_v = [];
    const second_v = []; 
    const third_v = []; 
    const fourth_v = [];
    const fifth_v = [];
    const solution_multi = [];
    const string_v = [];

    // say max = 10, min = -5, decimals = 2, RNG = 0.4543
    // step 1: 0.3*(max-min) + min = 0.4543*(15) -5 = 1.8145
    // step 2: round(1.8145*10^2) = round(181.45) = 181
    // step 3: 181/10^2 = 1.81 
    // thus we get our number to 2 decimals places with this logic

        
    for (let i = 0; i < questions; i++) {
                
        first_v.push(Math.round((Math.random()*(max-min) + min)*Math.pow(10,decimals))/Math.pow(10,decimals)); 
        second_v.push(Math.round((Math.random()*(max-min) + min)*Math.pow(10,decimals))/Math.pow(10,decimals));   
                    
        if(terms > 2) {

            third_v.push(Math.round((Math.random()*(max-min) + min)*10^Math.pow(10,decimals))/Math.pow(10,decimals));  }

         if(terms > 3) {

            fourth_v.push(Math.round((Math.random()*(max-min) + min)*Math.pow(10,decimals))/Math.pow(10,decimals));  }

        if(terms == 5) {

            fifth_v.push(Math.round((Math.random()*(max-min) + min)*Math.pow(10,decimals))/Math.pow(10,decimals));  }

    }

    for (let j = 0; j < questions; j++) {

        if(terms == 2) {

            solution_multi.push(first_v[j] * second_v[j]);
            string_v[j] = `${first_v[j]} * ${second_v[j]} ?`; }

        if(terms == 3) {

            solution_multi.push(first_v[j] * second_v[j] * third_v[j]);
            string_v[j] = `${first_v[j]} * ${second_v[j]} * ${third_v[j]} ?`; }

        if(terms == 4) {

            solution_multi.push(first_v[j] * second_v[j] * third_v[j] * fourth_v[j]);
            string_v[j] = `${first_v[j]} * ${second_v[j]} * ${third_v[j]} * ${fourth_v[j]}?`; }

        if(terms == 5) {

            solution_multi.push(first_v[j] * second_v[j] * third_v[j] * fourth_v[j] * fifth_v[j]);
            string_v[j] = `${first_v[j]} * ${second_v[j]} * ${third_v[j]} * ${fourth_v[j]} * ${fifth_v[j]}?`; }

    }

    // console.log(string_v, solution_multi);

    const finalQuestions = [];

    for (let i = 0; i < questions; i++) {
        finalQuestions.push({
            question: string_v[i],
            answer: solution_multi[i],
        });
    }

    return finalQuestions;

}

multiplication(1,5,0,2,0)