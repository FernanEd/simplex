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

export const iteration = (matrix: simplexMatriz) => {
	let m = [...matrix];
	let { pivotColumnIndx, pivotRowIndx } = getPivots(m);
	let intersection = m[pivotColumnIndx][pivotRowIndx];

	let pivotRow = m.map((columna) =>
		safeDivision(columna[pivotRowIndx], intersection)
	);

	let pivotColumn = m[pivotColumnIndx];

	m = m.map((column, i) =>
		column.map((value, j) => {
			if (j === pivotRowIndx) {
				return pivotRow[i];
			} else {
				return value - pivotColumn[j] * pivotRow[i];
			}
		})
	);

	// console.log(indiceRenglonPivote);
	// console.log(renglonPivote);
	// console.log(indiceColumnaPivote);
	// console.log(columnaPivote);
	// console.log(m);

	return m;
};

export const faseUno = (
	matriz: simplexMatriz,
	indicesVariablesR: simplexVariableR
) => {
	let m = [...matriz];

	const columnasVariablesR = m.filter((_, i) => indicesVariablesR.includes(i));

	[...columnasVariablesR].flat();

	const indicesColumnasSumar = columnasVariablesR
		.map((columna) => columna.indexOf(1))
		.flat();

	m = m.map((columna) =>
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

	let m2 = m;
	let isRPositive;
	let iterations = 0;

	do {
		m2 = iteration(m2);
		const lastRow = getLastRow(m2).slice(0, -1);
		isRPositive = lastRow.some((value) => value > 0);
		iterations++;
	} while (isRPositive && iterations < 50);

	if (iterations >= 50) {
		throw Error(
			`Demasiadas iteraciones, hay un problema con la matriz: ${matriz}`
		);
	}

	return m2;
};

const simplex = (
	matriz: simplexMatriz,
	indicesVariablesR: simplexVariableR,
	indicesVariables: simplexVariable,
	renglonZ: simplexRenglon
) => {
	const m1 = faseUno(matriz, indicesVariablesR).filter(
		(_, i) => !indicesVariablesR.includes(i)
	);

	let m = m1.map((columna, i) =>
		columna.map((value, j) => (j === columna.length - 1 ? renglonZ[i] : value))
	);

	for (let indiceVar of indicesVariables) {
		let columna = m[indiceVar];
		let indiceRenglonPseudoPivote = columna.indexOf(1);
		let interseccion = columna[columna.length - 1];

		//Multiplicar toda la tabla
		m = m.map((columna, i) =>
			columna.map((valor, j) => {
				if (j === columna.length - 1) {
					return fixNumbers(
						valor - interseccion * columna[indiceRenglonPseudoPivote]
					);
				} else {
					return valor;
				}
			})
		);

		let variablesX = m
			.map((columna) => columna[columna.length - 1])
			.filter((_, i) => indicesVariables.includes(i));

		let negativosEnVariables = variablesX.some((value) => value < 0);

		// console.log(variablesX, negativosEnVariables);

		if (!negativosEnVariables) {
			break;
		}

		// console.log(indiceVar);
		// console.log(interseccion);
		// console.log(columna);
		// console.log(indiceRenglonPseudoPivote);
		// console.log(m);
	}

	// FORMA BASICA FASE 2

	m;
	let iteraciones = 0;
	let isZPositive;

	do {
		m = iteration(m);
		const lastRow = getLastRow(m).slice(0, -1);
		isZPositive = lastRow.some((value) => value > 0);
		iteraciones++;
	} while (isZPositive && iteraciones < 50);

	console.log(m);
	// console.log(variablesX);
	// console.log(negativosEnVariables);
};

export default simplex;
