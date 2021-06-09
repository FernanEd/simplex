import { exit } from 'process';

type simplexMatriz = number[][];

type simplexVariableR = number[];

type simplexVariable = number[];

type simplexColumn = number[];

type simplexRenglon = number[];

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

		// console.log(m2);
		// console.log(ultimoRenglon);
		// console.log(positivosEnR);
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
	indicesVariablesR: simplexVariableR,
	indicesVariables: simplexVariable,
	renglonZ: simplexRenglon
) => {
	//Inicia fase 2
	// console.log(columnasVariablesR);
	// console.log(indicesColumnasSumar);
	// console.log(m);

	// try {

	// 	return m1;
	// } catch (e) {
	// 	console.log(e);
	// }

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
					return Number(
						Number(
							(
								valor -
								interseccion * columna[indiceRenglonPseudoPivote]
							).toFixed(5)
						).toPrecision(5)
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

	console.log(m);
	// console.log(variablesX);
	// console.log(negativosEnVariables);
};

// const obtenerUltimoRenglon = (matriz: simplexMatriz) =>

// const obtenerUltimaColumna = (matriz: simplexMatriz) =>

// const obtenerUltimoValor = (arreglo: number[]) =>

export default simplex;
