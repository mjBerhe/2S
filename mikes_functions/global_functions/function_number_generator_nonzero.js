module.exports = function nonzeroNumber (min, max) {

    const rng = Math.round(Math.random());

    return (Math.round((Math.random()*(max-min) + min))*Math.pow(-1,rng)); 

}