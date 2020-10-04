module.exports = function infinite_check (level, rng, alpha, beta, coeff_1, coeff_2, coeff_3, coeff_4) {

    // create infinite variable
    let infinite = false;

    if (level === 1) {
        if (rng <= 2 && alpha === beta && coeff_1 === 1) {infinite = true} ;
        if (rng > 2 && alpha === beta && coeff_1 === coeff_2) {infinite = true} ;
    }

    if (level === 2) {
        if (rng <= 2 && alpha === beta && coeff_2 === 1 && coeff_1 === coeff_3) {infinite = true} ;
        if (rng > 2 && alpha === beta && coeff_1 === -coeff_4 && coeff_2 === -coeff_3) {infinite = true} ;
    }

    if (level === 3) {
        if (rng <= 2 && alpha === beta && coeff_1 === coeff_4 && coeff_2 === coeff_3) {infinite = true} ;
        if (rng > 2 && alpha === beta && coeff_1 === coeff_3 && coeff_2 === coeff_4) {infinite = true} ;
    }

    //console.log(infinite) ;

    return infinite ;

}

//infinite_check(1, 3, 2, 2, 3, 3, 5, 6)