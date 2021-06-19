type matrix = number[][];
type header = string[];
type fnZ = string;

interface simplexParams {
	matrix: matrix;
	columnHeaders: header;
	rowHeaders: header;
	fnZ: fnZ;
}

export const fixNumber = (number: number) =>
	Number(Number(number.toFixed(6)).toPrecision(6));

export const fixMatrix = (matrix: matrix) =>
	matrix.map((column) => column.map((val) => fixNumber(val)));

export const getColumn = (matriz: matrix, columnIndex: number) => {
	return matriz.map((row) => row[columnIndex]);
};

export const copyArray = (matrix: matrix) => {
	let m = [];
	for (let i = 0; i < matrix.length; i++) {
		let row = [];
		for (let j = 0; j < matrix[0].length; j++) {
			row.push(matrix[i][j]);
		}
		m.push(row);
	}
	return m;
};

export const getPivots = (matrix: matrix, fnZ: fnZ) => {
	//Search in the last row, depending of fnZ the lowest negative or the higher positive
	let m = copyArray(matrix);
	//Get last row but cut out the result column
	let lastRow = m[m.length - 1].slice(0, -1);
	let columnPivotIndex = lastRow.indexOf(
		fnZ == 'min'
			? Math.max(...lastRow.filter((val) => val > 0))
			: Math.min(...lastRow.filter((val) => val < 0))
	);

	//Then divide result column by pivot column and get the row index of the lower positive
	//Minus the result row
	let resultColumn = getColumn(m, m[0].length - 1).slice(0, -1);
	let pivotColumn = getColumn(m, columnPivotIndex).slice(0, -1);
	let auxColumn = resultColumn.map((result, i) => result / pivotColumn[i]);

	//Filter values where number is divided by 0 or number is -0
	let rowPivotIndex = auxColumn.indexOf(
		Math.min(
			...auxColumn.filter(
				(val) => val >= 0 && val != Infinity && !Object.is(val, -0)
			)
		)
	);

	return {
		columnPivotIndex,
		rowPivotIndex,
	};
};

//Iteration has side-effects.
export const iteration = (
	matrix: matrix,
	fnZ: fnZ,
	columnHeaders: header,
	rowHeaders: header
) => {
	let m = copyArray(matrix);
	let { columnPivotIndex, rowPivotIndex } = getPivots(m, fnZ);
	let intersectionCoeficient = m[rowPivotIndex][columnPivotIndex];

	let pivotRow = m[rowPivotIndex].map((val) => val / intersectionCoeficient);

	// Make a new matrix, when the row is the pivot row, substitute with pivotRow
	// When not, get the value minus the pivot coeficient multiplied by the respective pivot row of the current column
	for (let row = 0; row < m.length; row++) {
		for (let col = 0; col < m[0].length; col++) {
			m[row][col] =
				row == rowPivotIndex
					? pivotRow[col]
					: matrix[row][col] - matrix[row][columnPivotIndex] * pivotRow[col];
		}
	}

	//Change headers
	rowHeaders[rowPivotIndex] = columnHeaders[columnPivotIndex];

	return fixMatrix(m);
};

const giveResults = (resultsColumn: number[], headers: header) => {
	let results: { [x: string]: number } = {};

	headers.forEach((header, i) => {
		results[header] =
			fixNumber(Math.round(fixNumber(resultsColumn[i]) * 10) / 10) || 0;
	});
	return results;
};

const simplexMethod = ({
	matrix,
	columnHeaders,
	rowHeaders,
	fnZ,
}: simplexParams) => {
	const twoPhases = columnHeaders.includes('r1');
	let m = copyArray(matrix);

	if (twoPhases) {
		//	FIRST PHASE

		//Save rowZ
		let rowZ = m[m.length - 1];
		//Replace with r row
		let rowR = columnHeaders.map((header) => (/r\d+/.test(header) ? -1 : 0));
		m[m.length - 1] = rowR;

		let columnRIndexes = columnHeaders
			.filter((header, i) => /r\d+/.test(header))
			.map((header) => columnHeaders.indexOf(header));

		let rowRIndexes = columnRIndexes.map((i) => getColumn(m, i).indexOf(1));
		let lastRow = rowR;

		for (let rowRIndex of rowRIndexes) {
			let row = m[rowRIndex];
			for (let i = 0; i < row.length; i++) lastRow[i] += row[i];
		}

		let iterationLimit = 50;
		let positiveLastRow;
		let iterations = 0;

		do {
			m = iteration(m, 'min', columnHeaders, rowHeaders);
			//Get last row but cut out the result column
			let lastRow = m[m.length - 1].slice(0, -1);
			positiveLastRow = lastRow.some((val) => val > 0);
			// console.log(m);
			iterations++;
		} while (positiveLastRow && iterations < iterationLimit);

		if (iterations >= iterationLimit) {
			throw Error(
				`Demasiadas iteraciones, hay un problema con la matriz: ${matrix}`
			);
		}

		// SECOND PHASE

		let m2 = m.map((column) =>
			column.filter((_, i) => !columnRIndexes.includes(i))
		);

		//Override lastrow with rowZ
		m2[m2.length - 1] = m2[0].map((_, i) => rowZ[i]);

		let varsIndexes = columnHeaders
			.filter((header, i) => /x\d+/.test(header))
			.map((header) => columnHeaders.indexOf(header));

		for (let varIndex of varsIndexes) {
			if (getColumn(m, varIndex).filter((val) => val == 1).length > 1) {
				continue;
			}
			let rowIndx = getColumn(m, varIndex).indexOf(1);
			let lastRow = m2[m2.length - 1];
			let pivot = lastRow[varIndex] * -1;

			m2[m2.length - 1] = lastRow.map((val, i) =>
				fixNumber(val + pivot * m2[rowIndx][i])
			);

			//Negative vars not working properly
			let negativeVars = m2[m2.length - 1]
				.filter((_, i) => varsIndexes.includes(i))
				.some((val) => val < 0);

			if (!negativeVars) break;
		}

		let iterationLimit2 = 50;
		let checkLastRow;
		let iterations2 = 0;

		// Iteration may be optional
		if (
			m2[m2.length - 1]
				.slice(0, -1)
				.some((val) => (fnZ == 'min' ? val > 0 : val < 0))
		) {
			do {
				m2 = iteration(m2, fnZ, columnHeaders, rowHeaders);
				//Get last row but cut out the result column
				let lastRow = m2[m2.length - 1].slice(0, -1);
				checkLastRow = lastRow.some((val) =>
					fnZ == 'min' ? val > 0 : val < 0
				);
				iterations2++;
			} while (checkLastRow && iterations2 < iterationLimit2);

			if (iterations2 >= iterationLimit2) {
				throw Error(
					`Demasiadas iteraciones, hay un problema con la matriz: ${matrix}`
				);
			}
		}

		let resultColumn = getColumn(m2, m2[0].length - 1);
		return giveResults(resultColumn, rowHeaders);
	} else {
		let iterationLimit = 50;
		let negativeLastRow;
		let iterations = 0;

		do {
			m = iteration(m, 'max', columnHeaders, rowHeaders);
			//Get last row but cut out the result column
			let lastRow = m[m.length - 1].slice(0, -1);
			negativeLastRow = lastRow.some((val) => val < 0);
			// console.log(m);
			iterations++;
		} while (negativeLastRow && iterations < iterationLimit);

		if (iterations >= iterationLimit) {
			throw Error(
				`Demasiadas iteraciones, hay un problema con la matriz: ${matrix}`
			);
		}

		let resultColumn = getColumn(m, m[0].length - 1);
		return giveResults(resultColumn, rowHeaders);
	}
};

export default simplexMethod;
