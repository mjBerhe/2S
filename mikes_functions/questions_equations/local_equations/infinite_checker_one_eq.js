module.exports = function infinite_check (level, rng, coeff_1, coeff_2, coeff_3, coeff_4, coeff_5, coeff_6, coeff_7, coeff_8) {

    // create infinite variable
    let infinite = 0;

    if (level === 2) {

        if (rng === 1) {

            if (coeff_2 === coeff_2 + coeff_1*(coeff_3-coeff_4) && coeff_3 === coeff_4) {infinite = 1} ;
        }

        if (rng === 5) {

            if (coeff_2 === coeff_3 && -coeff_2 - coeff_3 - coeff_4 === coeff_4) {infinite = 1} ;
        }

    } else if (level === 3) {

        if (rng === 1) {
            
            if (coeff_2*coeff_3 + coeff_3*(coeff_5*coeff_1 +coeff_6 - coeff_2 - coeff_4*coeff_1) === coeff_6*coeff_3 && coeff_3*coeff_4 === coeff_3*coeff_5) {infinite = 1} ;
        }

        if (rng === 2) {

            if (coeff_2*coeff_4 === coeff_4*(coeff_2+coeff_3*coeff_1 - coeff_5*coeff_1) && coeff_3*coeff_4 === coeff_4*coeff_5) {infinite = 1} ;
        }


    }    

    return infinite ;

}