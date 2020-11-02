module.exports = function randomNumber (min, max) {

    return (Math.round((Math.random()*(max-min) + min))); 

}