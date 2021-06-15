import simplexMethod from './simplexMethod';

const m1 = {
	matrix: [
		[1, 1, 1, 0, 0, 5000],
		[1, 0, 0, 1, 0, 4500],
		[-0.33333333333, 1, 0, 0, 1, 0],
		[-30, -40, 0, 0, 0, 0],
	],
	columnHeaders: ['x1', 'x2', 's1', 's2', 's3', 'res'],
	rowHeaders: ['s1', 's2', 's3', 'z'],
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
};

const m3 = {
	matrix: [
		[1, 4, 2, -1, 0, 1, 0, 8],
		[3, 2, 0, 0, -1, 0, 1, 6],
		[-2, -3, -1, 0, 0, 0],
	],
	columnHeaders: ['x1', 'x2', 'x3', 'e1', 'e2', 'r1', 'r2', 'res'],
	rowHeaders: ['r1', 'r2', 'z'],
};

const m4 = {
	matrix: [
		[1, 1, 1, 0, 0, 0, 0, 9],
		[1, 0, 0, 1, 0, 0, 0, 10],
		[0, 1, 0, 0, 1, 0, 0, 8],
		[50, 40, 0, 0, 0, -1, 1, 400],
		[-800, -600, 0, 0, 0, 0, 0],
	],
	columnHeaders: ['x1', 'x2', 's1', 's2', 's3', 'e1', 'r1', 'res'],
	rowHeaders: ['s1', 's2', 's3', 'r1', 'z'],
};

test('', () => {
	expect(simplexMethod(m1)).toBe(2);
});

test('', () => {
	expect(simplexMethod(m2)).toBe(2);
});

test('', () => {
	expect(simplexMethod(m3)).toBe(1);
});

test('', () => {
	expect(simplexMethod(m4)).toBe(1);
});
