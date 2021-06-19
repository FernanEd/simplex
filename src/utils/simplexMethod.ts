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
		results[header] = Math.round(fixNumber(resultsColumn[i])) || 0;
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
		return { a: 1 };
	} else {
		let iterationLimit = 50;
		let negativesLastRow;
		let iterations = 0;

		do {
			m = iteration(m, 'max', columnHeaders, rowHeaders);
			//Get last row but cut out the result column
			let lastRow = m[m.length - 1].slice(0, -1);
			negativesLastRow = lastRow.some((val) => val < 0);
			// console.log(m);
			iterations++;
		} while (negativesLastRow && iterations < iterationLimit);

		if (iterations >= iterationLimit) {
			throw Error(
				`Demasiadas iteraciones, hay un problema con la matriz: ${matrix}`
			);
		}

		let resultColumn = getColumn(m, m[0].length - 1);
		return giveResults(resultColumn, rowHeaders);
	}

	/*
    TWO PHASE ALGORITM

    First phase: 
    Save the z row
    Override it with a new r row where everything is 0 
    except the r columns which are -1
    Solve for a basic solution: find the columns where r is -1.
    Find the rows where the column is 1
    Then multiply the last row by those indexes

    * Start iterating for the max positive number until there are no positive numbers

    Second phase:
    Copy the matrix from the first phase excluding columns r
    Override the last row with the saved z row
    Solve for a basic solution: x column by x column
    find the row where the column is 1: multiply the last row by those indexes
    if the x columns in the last row are positive stop.
    
    if minZ
    * Start iterating for the max positive until there are no positive numbers
    if maxZ
    * Start iterating for the max positive until there are no negative numbers

  */

	/*
    SIMPLEX ALGORITHM
    * Start iterating for the max positive until there are no negative numbers
  */
};

export default simplexMethod;
