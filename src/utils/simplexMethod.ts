interface simplexParams {
	matrix: number[][];
	columnHeaders: string[];
	rowHeaders: string[];
}

const simplexMethod = ({
	matrix,
	columnHeaders,
	rowHeaders,
}: simplexParams) => {
	const twoPhases = columnHeaders.includes('r1');
	let m = [...matrix];

	if (twoPhases) {
		return 1;
	} else {
		return 2;
	}

	// If is two phases, go with the first phase, then the second one

	// If is one phase, make it simple.
};

export default simplexMethod;
