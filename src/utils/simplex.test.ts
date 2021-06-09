import simplex, { faseUno, iteracion, sacarPivotes } from './simplex';

const smallMatrix = [
	[1, 1, 0, 50, 0],
	[1, 0, 1, 40, 0],
	[1, 0, 0, 0, 0],
	[0, 1, 0, 0, 0],
	[0, 0, 1, 0, 0],
	[0, 0, 0, -1, 0],
	[0, 0, 0, 1, -1],
	[9, 10, 8, 400, 0],
];

const smallMatrixBasic = [
	[1, 1, 0, 50, 50],
	[1, 0, 1, 40, 40],
	[1, 0, 0, 0, 0],
	[0, 1, 0, 0, 0],
	[0, 0, 1, 0, 0],
	[0, 0, 0, -1, -1],
	[0, 0, 0, 1, 0],
	[9, 10, 8, 400, 400],
];

const largeMatrix = [
	[1, 3, 0],
	[4, 2, 0],
	[2, 0, 0],
	[-1, 0, 0],
	[0, -1, 0],
	[1, 0, -1],
	[0, 1, -1],
	[8, 6, 0],
];

const largeMatrixBasica = [
	[1, 3, 4],
	[4, 2, 6],
	[2, 0, 2],
	[-1, 0, -1],
	[0, -1, -1],
	[1, 0, 0],
	[0, 1, 0],
	[8, 6, 14],
];

// test('simplex in the house', () => {
// 	expect(simplex(smallMatrix, [6])).toBe(3);
// });

test('simplex in the house', () => {
	expect(simplex(largeMatrix, [5, 6])).toBe(3);
});

test('fase uno funciona', () => {
	expect(faseUno(largeMatrix, [5, 6])).toEqual([
		[0, 1, 0],
		[1, 0, 0],
		[0.6, -0.4, 0],
		[-0.3, 0.2, 0],
	]);
});

// test('iteracion funciona', () => {
// 	expect(
// 		iteracion(smallMatrixBasic).map((col) =>
// 			col.map((value) => Number(value.toPrecision(4)))
// 		)
// 	).toEqual([
// 		[0, 0, 0, 1, 0],
// 		[0.2, -0.8, 1, 0.8, 0],
// 		[1, 0, 0, 0, 0],
// 		[0, 1, 0, 0, 0],
// 		[0, 0, 1, 0, 0],
// 		[0.02, 0.02, 0, -0.02, 0],
// 		[-0.02, -0.02, 0, 0.02, -1],
// 		[1, 2, 8, 8, 0],
// 	]);
// });

// test('iteracion funciona', () => {
// 	expect(iteracion(largeMatrixBasica)).toEqual([
// 		[0.25, 2.5, 2.5],
// 		[1, 0, 0],
// 		[0.5, -1, -1],
// 		[-0.25, 0.5, 0.5],
// 		[0, -1, -1],
// 		[0.25, -0.5, -1.5],
// 		[0, 1, 0],
// 		[2, 2, 2],
// 	]);
// });

// test('sacar pivotes funciona', () => {
// 	expect(sacarPivotes(smallMatrixBasic)).toEqual({
// 		indiceColumnaPivote: 0,
// 		indiceRenglonPivote: 3,
// 	});
// });

// test('sacar pivotes funciona', () => {
// 	expect(sacarPivotes(largeMatrixBasica)).toEqual({
// 		indiceColumnaPivote: 1,
// 		indiceRenglonPivote: 0,
// 	});
// });