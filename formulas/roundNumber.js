const roundNumber = (num, decimal) => {
	// if rounding accuracy, change it to a percentage instead of a decimal
	// if (decimal === 2) {
	// 	num *= 100;
	// }
	let roundedNum = num*(Math.pow(10, decimal));
	roundedNum = Math.round(roundedNum);
	roundedNum = roundedNum/Math.pow(10, decimal);

	return roundedNum;
}

export { roundNumber };