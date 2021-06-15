type matrix = number[][];
type header = string[];

interface simplexParams {
	matrix: matrix;
	columnHeaders: header;
	rowHeaders: header;
}

const fixMatriz = (matrix: matrix) =>
	matrix.map((column) =>
		column.map((val) => Number(Number(val.toFixed(6)).toPrecision(6)))
	);

const getPivots = (matrix: matrix, search: 'min' | 'max') => {};

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

	/*
    TWO PHASE ALGORITM

    First phase: 
    Save the z row
    Override it with a new row where everything is 0 
    except the r columns which are -1
    Solve for a basic solution: find the columns where r is -1.
    Find the rows where the column is 1
    Then multiply the last row by those indexes

    * Start iterating for the max positive number until there are no positive numbers

    Second phase:
    Cut the matrix excluding columns r
    Override the last row with the saved z row
    Solve for a basic solution: x column by x column
    find the row where the column is 1: multiply the last row by those indexes
    if the x columns in the last row are positive stop.
    
    * Start iterating for the max positive until there are no positive numbers
  */

	/*
    SIMPLEX ALGORITHM

    * Start iterating for the min negative until there are no negative numbers
  */
};

export default simplexMethod;
