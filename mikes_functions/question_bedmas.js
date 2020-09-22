function bedmas(questions, max_add, min_add, max_multi, min_multi, level) {

    // questions > 0
    // max and min are boundless
    // level can be between 1-4
    // decimal defines how many decimals in the number

    // create the vectors for addition

    const first_v = [];
    const second_v = []; 
    const third_v = []; 
    const fourth_v = [];
    const fifth_v = [];
    const sixth_v = [];
    const seventh_v = [];
    const eighth_v = [];
    const solution_bedmas = [];
    const string_v = [];

 
    for (let i = 0; i < questions; i++) {
                
        first_v.push(Math.round((Math.random()*(max_multi-min_multi) + min_multi))); 
        second_v.push(Math.round((Math.random()*(max_add-min_add) + min_add))); 
        third_v.push(Math.round((Math.random()*(max_add-min_add) + min_add)));  
                    
        if(level > 1) {

            fourth_v.push(Math.round((Math.random()*(max_add-min_add) + min_add))); }

         if(level > 2) {

            fifth_v.push(Math.round((Math.random()*(max_multi-min_multi) + min_multi))); 
            sixth_v.push(Math.round((Math.random()*(max_add-min_add) + min_add))); }

        if(level == 4) {

            seventh_v.push(Math.round((Math.random()*(max_multi-min_multi) + min_multi)));
            eighth_v.push(Math.round((Math.random()*(max_multi-min_multi) + min_multi))) }

    }

    // level 1: 3 ( 4 +/- 11 )
    // level 2: 3 ( 4 +/- 11 ) +/- 16. last number can be a fraction
    // level 3: 3 ( 4 +/- 11 ) +/- 16 ( 5 +/- 15 ). both coefficents can be a fraction
    // level 4: 3 ( 4 +/- 11 * 2 ) +/- 16 ( 5 +/- 15 * 3 ). both coefficients can be a fraction

    for (let j = 0; j < questions; j++) {

        let operator_1 = Math.round(Math.random());
        let operator_2 = Math.round(Math.random());
        let operator_3 = Math.round(Math.random());

        if(level == 1) {

            solution_bedmas.push(first_v[j] * (second_v[j] + third_v[j] * Math.pow(-1,operator_1)));
            
            if(operator_1 == 0) {

                string_v[j] = `${first_v[j]} * ( ${second_v[j]} + ${third_v[j]} )?`;

            } else { string_v[j] = `${first_v[j]} * ( ${second_v[j]} - ${third_v[j]} ) ?`}
            
        }

        if(level == 2) {

            solution_bedmas.push(first_v[j] * (second_v[j] + third_v[j] * Math.pow(-1,operator_1)) + Math.pow(-1,operator_2) * fourth_v[j]);

            if(operator_1 == 0 && operator_2 == 0) { string_v[j] = `${first_v[j]} * (${second_v[j]} + ${third_v[j]}) + ${fourth_v[j]} ?`};
            if(operator_1 == 0 && operator_2 == 1) { string_v[j] = `${first_v[j]} * (${second_v[j]} + ${third_v[j]}) - ${fourth_v[j]} ?`};
            if(operator_1 == 1 && operator_2 == 0) { string_v[j] = `${first_v[j]} * (${second_v[j]} - ${third_v[j]}) + ${fourth_v[j]} ?`};
            if(operator_1 == 1 && operator_2 == 1) { string_v[j] = `${first_v[j]} * (${second_v[j]} - ${third_v[j]}) - ${fourth_v[j]} ?`};

        }

        if(level == 3) {

            solution_bedmas.push(first_v[j] * (second_v[j] + third_v[j] * Math.pow(-1,operator_1)) + fourth_v[j] * Math.pow(-1,operator_2) * (fifth_v[j] + sixth_v[j] * Math.pow(-1,operator_3)));
            
            if(operator_1 == 0 && operator_2 == 0 && operator_3 == 0) {string_v[j] = `${first_v[j]} * (${second_v[j]} + ${third_v[j]}) + ${fourth_v[j]} * (${fifth_v[j]} + ${sixth_v[j]}) ?`};
            if(operator_1 == 1 && operator_2 == 0 && operator_3 == 0) {string_v[j] = `${first_v[j]} * (${second_v[j]} - ${third_v[j]}) + ${fourth_v[j]} * (${fifth_v[j]} + ${sixth_v[j]}) ?`};
            if(operator_1 == 0 && operator_2 == 1 && operator_3 == 0) {string_v[j] = `${first_v[j]} * (${second_v[j]} + ${third_v[j]}) - ${fourth_v[j]} * (${fifth_v[j]} + ${sixth_v[j]}) ?`};
            if(operator_1 == 0 && operator_2 == 0 && operator_3 == 1) {string_v[j] = `${first_v[j]} * (${second_v[j]} + ${third_v[j]}) + ${fourth_v[j]} * (${fifth_v[j]} - ${sixth_v[j]}) ?`};
            if(operator_1 == 1 && operator_2 == 1 && operator_3 == 0) {string_v[j] = `${first_v[j]} * (${second_v[j]} - ${third_v[j]}) - ${fourth_v[j]} * (${fifth_v[j]} + ${sixth_v[j]}) ?`};
            if(operator_1 == 1 && operator_2 == 0 && operator_3 == 1) {string_v[j] = `${first_v[j]} * (${second_v[j]} - ${third_v[j]}) + ${fourth_v[j]} * (${fifth_v[j]} - ${sixth_v[j]}) ?`};
            if(operator_1 == 0 && operator_2 == 1 && operator_3 == 1) {string_v[j] = `${first_v[j]} * (${second_v[j]} + ${third_v[j]}) - ${fourth_v[j]} * (${fifth_v[j]} - ${sixth_v[j]}) ?`};
            if(operator_1 == 1 && operator_2 == 1 && operator_3 == 1) {string_v[j] = `${first_v[j]} * (${second_v[j]} - ${third_v[j]}) - ${fourth_v[j]} * (${fifth_v[j]} - ${sixth_v[j]}) ?`};

        }

        if(level == 4) {

            // level 4 not complete

            solution_bedmas.push(first_v[j] * second_v[j] * third_v[j] * fourth_v[j] * fifth_v[j]);
            string_v[j] = `${first_v[j]} * ${second_v[j]} * ${third_v[j]} * ${fourth_v[j]} * ${fifth_v[j]}?`; 
        
        }

    }

    console.log(string_v, solution_bedmas);

    // const finalQuestions = [];

    // for (let i = 0; i < questions; i++) {
    //     finalQuestions.push({
    //         question: string_v[i],
    //         answer: solution_bedmas[i],
    //     });
    // }

    // return finalQuestions;

}

bedmas(5,10,1,10,1,2)