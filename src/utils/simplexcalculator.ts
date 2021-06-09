type simplexMatriz = number[][];

type simplexVariableR = number[];

type simplexVariable = number[];

type simplexColumn = number[];

type simplexRenglon = number[];

export const fixNumbers = (n: number, precision = 6) =>
	Number(Number(n.toFixed(precision)).toPrecision(precision));

export const getLastRow = (matrix: simplexMatriz) => {
	return matrix.map((column) => column[column.length - 1]);
};

export const getLastColumn = (matrix: simplexMatriz) => {
	return matrix[matrix.length - 1];
};

export const safeDivision = (coeficient: number, divisor: number) => {
	if (divisor === 0) return 0;
	else {
		return coeficient / divisor;
	}
};

export const getPivots = (matriz: simplexMatriz) => {
	let m = [...matriz];
	//Ultimo renglon sin contar la celda de resultado
	const lastRow = getLastRow(m).slice(0, -1);
	const pivotColumnIndx = lastRow.indexOf(Math.max(...lastRow));
	//Columna de resultados sin contar la celda de r
	const resultsColumn = getLastColumn(m).slice(0, -1);

	const auxColumn = resultsColumn.map((val, i) =>
		resultsColumn[i] !== 0 ? val / m[pivotColumnIndx][i] : 0
	);

	const pivotRowIndx = auxColumn.indexOf(
		Math.min(...auxColumn.filter((val) => val >= 0))
	);

	return { pivotColumnIndx, pivotRowIndx };
};

export class SimplexCalculator {
	private m;
	private indicesVariablesR;
	private indicesVariables;
	private renglonZ;
	private columnHeaders;
	private rowHeaders;

	constructor(
		matriz: simplexMatriz,
		indicesVariablesR: simplexVariableR,
		indicesVariables: simplexVariable,
		renglonZ: simplexRenglon,
		columnHeaders: string[],
		rowHeaders: string[]
	) {
		this.m = matriz;
		this.indicesVariablesR = indicesVariablesR;
		this.indicesVariables = indicesVariables;
		this.renglonZ = renglonZ;
		this.columnHeaders = columnHeaders;
		this.rowHeaders = rowHeaders;
	}

	iteration() {
		let { pivotColumnIndx, pivotRowIndx } = getPivots(this.m);
		let intersection = this.m[pivotColumnIndx][pivotRowIndx];

		let pivotRow = this.m.map((column) =>
			safeDivision(column[pivotRowIndx], intersection)
		);

		let pivotColumn = this.m[pivotColumnIndx];

		this.m = this.m.map((column, i) =>
			column.map((value, j) => {
				if (j === pivotRowIndx) {
					return pivotRow[i];
				} else {
					return value - pivotColumn[j] * pivotRow[i];
				}
			})
		);

		this.rowHeaders[pivotRowIndx] = this.columnHeaders[pivotColumnIndx];
	}

	phaseOne() {
		const columnasVariablesR = this.m.filter((_, i) =>
			this.indicesVariablesR.includes(i)
		);

		const indicesColumnasSumar = columnasVariablesR
			.map((columna) => columna.indexOf(1))
			.flat();

		this.m = this.m.map((columna) =>
			columna.map((val, i) => {
				if (i === columna.length - 1) {
					return (
						val +
						indicesColumnasSumar
							.map((indice) => columna[indice])
							.reduce((a, b) => a + b, 0)
					);
				} else {
					return val;
				}
			})
		);
	}
}
