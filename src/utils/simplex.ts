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
	if (divisor === 0) return null;
	else {
		return coeficient / divisor;
	}
};

export const fixMatrix = (matriz: simplexMatriz) => {
	return matriz.map((columna) => columna.map((value) => fixNumbers(value)));
};

export const getPivots = (matriz: simplexMatriz, simplexOne?: boolean) => {
	let m = [...matriz];
	//Ultimo renglon sin contar la celda de resultado
	const lastRow = getLastRow(m).slice(0, -1);

	const pivotColumnIndx = simplexOne
		? lastRow.indexOf(Math.min(...lastRow.filter((value) => value < 0)))
		: lastRow.indexOf(Math.max(...lastRow));
	//Columna de resultados sin contar la celda de r
	const resultsColumn = getLastColumn(m).slice(0, -1);

	console.log(
		m,
		pivotColumnIndx,
		lastRow,
		lastRow.filter((value) => value < 0)
	);

	const auxColumn = resultsColumn.map((val, i) =>
		resultsColumn[i] !== 0 ? val / m[pivotColumnIndx][i] : 0
	);

	const pivotRowIndx = auxColumn.indexOf(
		Math.min(...auxColumn.filter((val) => val > 0))
	);

	return { pivotColumnIndx, pivotRowIndx };
};

const simplex = (
	matriz: simplexMatriz,
	indicesVariablesR: simplexVariableR,
	indicesVariables: simplexVariable,
	renglonZ: simplexRenglon,
	columnHeaders: string[],
	rowHeaders: string[],
	skipPhase1: boolean
) => {
	const iteration = (matrix: simplexMatriz) => {
		let m = [...matrix];
		let { pivotColumnIndx, pivotRowIndx } = getPivots(m, skipPhase1);
		let intersection = m[pivotColumnIndx][pivotRowIndx];

		let pivotRow = m.map((columna) =>
			safeDivision(columna[pivotRowIndx], intersection)
		);

		let pivotColumn = m[pivotColumnIndx];

		m = m.map((column, i) =>
			column.map((value, j) => {
				if (j === pivotRowIndx) {
					return pivotRow[i] || 0;
				} else {
					return value - pivotColumn[j] * (pivotRow[i] || 0);
				}
			})
		);

		rowHeaders[pivotRowIndx] = columnHeaders[pivotColumnIndx];

		console.log('col', pivotColumnIndx, 'row', pivotRowIndx);

		// console.log(indiceRenglonPivote);
		// console.log(renglonPivote);
		// console.log(indiceColumnaPivote);
		// console.log(columnaPivote);
		// console.log(m);

		return m;
	};

	const faseUno = (
		matriz: simplexMatriz,
		indicesVariablesR: simplexVariableR
	) => {
		let m = [...matriz];

		const columnasVariablesR = m.filter((_, i) =>
			indicesVariablesR.includes(i)
		);

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
			m2 = fixMatrix(iteration(m2));
			const lastRow = getLastRow(m2).slice(0, -1);
			isRPositive = lastRow.some((value) => value > 0);
			iterations++;

			console.log(m2);
		} while (isRPositive && iterations < 50);

		if (iterations >= 50) {
			throw Error(
				`Demasiadas iteraciones, hay un problema con la matriz: ${matriz}`
			);
		}

		return m2;
	};

	const phaseTwo = (
		matriz: simplexMatriz,
		indicesVariables: simplexVariable
	) => {
		let m = [...matriz];
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

			if (!negativosEnVariables) {
				break;
			}
		}

		let m2 = m;
		let iterations = 0;
		let isZPositive;

		do {
			m2 = iteration(m2);
			const lastRow = getLastRow(m2).slice(0, -1);
			isZPositive = lastRow.some((value) => value > 0);
			iterations++;

			console.log('iteracion', m2);
		} while (isZPositive && iterations < 50);

		if (iterations >= 50) {
			throw Error(
				`Demasiadas iteraciones, hay un problema con la matriz: ${matriz}`
			);
		}

		return m2;
	};

	//Relative code

	//Get phase two basic table (minus R vars)

	let m1;
	if (skipPhase1) {
		m1 = matriz;
	} else {
		m1 = faseUno(matriz, indicesVariablesR).filter(
			(_, i) => !indicesVariablesR.includes(i)
		);
	}

	//Replace r row with Z row
	let m = m1.map((columna, i) =>
		columna.map((value, j) => (j === columna.length - 1 ? renglonZ[i] : value))
	);

	console.log('primer matriz', m);

	let m2 = phaseTwo(m, indicesVariables);
	let results = m2[m2.length - 1];

	// console.log(results);
	// console.log(rowHeaders);

	let solution: { [x: string]: number } = {};

	rowHeaders.forEach((header, i) => {
		solution[header] = fixNumbers(results[i]);
	});

	return solution;
};

export default simplex;
