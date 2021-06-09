type simplexMatriz = number[][];

type simplexVariableR = number[];

type simplexColumn = number[];

export const sacarPivotes = (matriz: simplexMatriz) => {
	let m = [...matriz];
	//Ultimo renglon sin contar la columna resultados
	const ultimoRenglon = m
		.map((columna) => columna[columna.length - 1])
		.slice(0, -1);
	const indiceColumnaPivote = ultimoRenglon.indexOf(Math.max(...ultimoRenglon));
	//Columna de resultados sin contar el renglon r
	const columnaResultados = m[m.length - 1].slice(0, -1);
	const columnaAux = columnaResultados.map((val, i) =>
		columnaResultados[i] !== 0 ? val / m[indiceColumnaPivote][i] : 0
	);
	const indiceRenglonPivote = columnaAux.indexOf(
		Math.min(...columnaAux.filter((val) => val >= 0))
	);
	return { indiceColumnaPivote, indiceRenglonPivote };
};

export const iteracion = (matriz: simplexMatriz) => {
	let m = [...matriz];
	let { indiceColumnaPivote, indiceRenglonPivote } = sacarPivotes(matriz);
	let interseccion = m[indiceColumnaPivote][indiceRenglonPivote];

	let renglonPivote = m.map(
		(columna) => columna[indiceRenglonPivote] / interseccion
	);

	let columnaPivote = m[indiceColumnaPivote];

	m = m.map((columna, i) =>
		columna.map((value, j) => {
			if (j === indiceRenglonPivote) {
				return renglonPivote[i];
			} else {
				return value - columnaPivote[j] * renglonPivote[i];
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
	let positivosEnR;
	let iteraciones = 0;

	do {
		m2 = iteracion(m2);

		const ultimoRenglon = m2
			.map((columna) => columna[columna.length - 1])
			.slice(0, -1);
		positivosEnR = ultimoRenglon.some((value) => value > 0);
		iteraciones++;

		console.log(m2);
		console.log(ultimoRenglon);
		console.log(positivosEnR);
	} while (positivosEnR && iteraciones < 50);

	if (iteraciones >= 50) {
		throw Error(
			`Demasiadas iteraciones, hay un problema con la matriz: ${matriz}`
		);
	}

	return m2;
};

const simplex = (
	matriz: simplexMatriz,
	indicesVariablesR: simplexVariableR
) => {
	//Inicia fase 2
	// console.log(columnasVariablesR);
	// console.log(indicesColumnasSumar);
	// console.log(m);

	try {
		const m1 = faseUno(matriz, indicesVariablesR);

		return m1;
	} catch (e) {
		console.log(e);
	}
};

export default simplex;
