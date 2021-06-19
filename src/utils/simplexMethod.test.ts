import simplexMethod, {
	getColumn,
	getPivots,
	iteration,
} from './simplexMethod';

const m1 = {
	matrix: [
		[1, 1, 1, 0, 0, 5000],
		[1, 0, 0, 1, 0, 4500],
		[-0.33333333333, 1, 0, 0, 1, 0],
		[-30, -40, 0, 0, 0, 0],
	],
	columnHeaders: ['x1', 'x2', 's1', 's2', 's3', 'res'],
	rowHeaders: ['s1', 's2', 's3', 'z'],
	fnZ: 'max',
};

const m2 = {
	matrix: [
		[2, 3, 1, 0, 0, 600],
		[1, 1, 0, 1, 0, 500],
		[2, 1, 0, 0, 1, 400],
		[-6.5, -7, 0, 0, 0, 0],
	],
	columnHeaders: ['x1', 'x2', 's1', 's2', 's3', 'res'],
	rowHeaders: ['s1', 's2', 's3', 'z'],
	fnZ: 'max',
};

const m3 = {
	matrix: [
		[1, 4, 2, -1, 0, 1, 0, 8],
		[3, 2, 0, 0, -1, 0, 1, 6],
		[-2, -3, -1, 0, 0, 0, 0, 0],
	],
	columnHeaders: ['x1', 'x2', 'x3', 'e1', 'e2', 'r1', 'r2', 'res'],
	rowHeaders: ['r1', 'r2', 'z'],
	fnZ: 'min',
};

const m4 = {
	matrix: [
		[1, 1, 1, 0, 0, 0, 0, 9],
		[1, 0, 0, 1, 0, 0, 0, 10],
		[0, 1, 0, 0, 1, 0, 0, 8],
		[50, 40, 0, 0, 0, -1, 1, 400],
		[-800, -600, 0, 0, 0, 0, 0, 0],
	],
	columnHeaders: ['x1', 'x2', 's1', 's2', 's3', 'e1', 'r1', 'res'],
	rowHeaders: ['s1', 's2', 's3', 'r1', 'z'],
	fnZ: 'min',
};

const m5 = {
	matrix: [
		[1, 1, 1, 0, 0, 0, 0, 210000],
		[1, 0, 0, 1, 0, 0, 0, 130000],
		[1, -2, 0, 0, 1, 0, 0, 0],
		[0, 1, 0, 0, 0, -1, 1, 60000],
		[-0.1, -0.08, 0, 0, 0, 0, 0, 0],
	],
	columnHeaders: ['x1', 'x2', 's1', 's2', 's3', 'e1', 'r1', 'res'],
	rowHeaders: ['s1', 's2', 's3', 'r1', 'z'],
	fnZ: 'max',
};

const m6 = {
	matrix: [
		[1, 2, -1, 0, 0, 1, 0, 0, 80],
		[3, 2, 0, -1, 0, 0, 1, 0, 160],
		[5, 2, 0, 0, -1, 0, 0, 1, 200],
		[-2000, -2000, 0, 0, 0, 0],
	],
	columnHeaders: ['x1', 'x2', 'e1', 'e2', 'e3', 'r1', 'r2', 'r3', 'res'],
	rowHeaders: ['r1', 'r2', 'r3', 'z'],
	fnZ: 'min',
};

test('Simplex for MaxZ & no Rs works', () => {
	expect(simplexMethod(m1)).toEqual({
		s2: 750,
		x1: 3750,
		x2: 1250,
		z: 162500,
	});
});

test('Simplex for MaxZ & no Rs works', () => {
	expect(simplexMethod(m2)).toEqual({
		s2: 250,
		x1: 150,
		x2: 100,
		z: 1675,
	});
});

test('Simplex for MinZ with Rs works', () => {
	expect(simplexMethod(m3)).toEqual({
		x2: 1.8,
		x1: 0.8,
		z: 7,
	});
});

test('Simplex for MinZ with Rs works', () => {
	expect(simplexMethod(m4)).toEqual({
		x1: 4,
		x2: 5,
		s2: 6,
		s3: 3,
		z: 6200,
	});
});

test('Simplex for MinZ with Rs works', () => {
	expect(simplexMethod(m5)).toEqual({
		x1: 130000,
		x2: 80000,
		e1: 20000,
		s3: 30000,
		z: 19400,
	});
});

test('Simplex for MinZ with Rs works', () => {
	expect(simplexMethod(m6)).toEqual({
		x1: 40,
		x2: 20,
		e3: 40,
		z: 120000,
	});
});

test('iteration works 1', () => {
	expect(iteration(m1.matrix, 'max', m1.columnHeaders, m1.rowHeaders)).toEqual([
		[1.33333, 0, 1, 0, -1, 5000],
		[1, 0, 0, 1, 0, 4500],
		[-0.333333, 1, 0, 0, 1, 0],
		[-43.3333, 0, 0, 0, 40, 0],
	]);
});

test('iteration works 2', () => {
	expect(iteration(m2.matrix, 'max', m2.columnHeaders, m2.rowHeaders)).toEqual([
		[0.666667, 1, 0.333333, 0, 0, 200],
		[0.333333, 0, -0.333333, 1, 0, 300],
		[1.33333, 0, -0.333333, 0, 1, 200],
		[-1.83333, 0, 2.33333, 0, 0, 1400],
	]);
});

test('iteration works 3', () => {
	expect(
		iteration(
			[
				[1, 4, 2, -1, 0, 1, 0, 8],
				[3, 2, 0, 0, -1, 0, 1, 6],
				[4, 6, 2, -1, -1, 0, 0, 0],
			],
			'min',
			m3.columnHeaders,
			m3.rowHeaders
		)
	).toEqual([
		[0.25, 1, 0.5, -0.25, 0, 0.25, 0, 2],
		[2.5, 0, -1, 0.5, -1, -0.5, 1, 2],
		[2.5, 0, -1, 0.5, -1, -1.5, 0, -12],
	]);
});

test('iteration works 4', () => {
	expect(
		iteration(
			[
				[1, 1, 1, 0, 0, 0, 0, 9],
				[1, 0, 0, 1, 0, 0, 0, 10],
				[0, 1, 0, 0, 1, 0, 0, 8],
				[50, 40, 0, 0, 0, -1, 1, 400],
				[50, 40, 0, 0, 0, -1, 0, 400],
			],
			'min',
			m1.columnHeaders,
			m2.rowHeaders
		)
	).toEqual([
		[0, 0.2, 1, 0, 0, 0.02, -0.02, 1],
		[0, -0.8, 0, 1, 0, 0.02, -0.02, 2],
		[0, 1, 0, 0, 1, 0, 0, 8],
		[1, 0.8, 0, 0, 0, -0.02, 0.02, 8],
		[0, 0, 0, 0, 0, 0, -1, 0],
	]);
});

test('getPivots works 1', () => {
	expect(getPivots(m1.matrix, 'max')).toEqual({
		columnPivotIndex: 1,
		rowPivotIndex: 2,
	});
});

test('getPivots works 2', () => {
	expect(getPivots(m2.matrix, 'max')).toEqual({
		columnPivotIndex: 1,
		rowPivotIndex: 0,
	});
});

test('getPivots works 3', () => {
	expect(
		getPivots(
			[
				[1, 4, 2, -1, 0, 1, 0, 8],
				[3, 2, 0, 0, -1, 0, 1, 6],
				[1, 4, 2, -1, 0, 0, -1],
			],
			'min'
		)
	).toEqual({
		columnPivotIndex: 1,
		rowPivotIndex: 0,
	});
});

test('getPivots works 4', () => {
	expect(
		getPivots(
			[
				[1, 1, 1, 0, 0, 0, 0, 9],
				[1, 0, 0, 1, 0, 0, 0, 10],
				[0, 1, 0, 0, 1, 0, 0, 8],
				[50, 40, 0, 0, 0, -1, 1, 400],
				[50, 40, 0, 0, -1, 0, 0],
			],
			'min'
		)
	).toEqual({
		columnPivotIndex: 0,
		rowPivotIndex: 3,
	});
});

test('getColumn works', () => {
	expect(getColumn(m1.matrix, 5)).toEqual([5000, 4500, 0, 0]);
});
