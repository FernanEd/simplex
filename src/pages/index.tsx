import React, { useState } from 'react';
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import simplex from '../utils/simplex';

interface formData {
	[x: string]: string;
}

interface resultado {
	[x: string]: number;
}

const IndexPage: React.FunctionComponent = () => {
	const { register, handleSubmit } = useForm();

	const [variables, setVariables] = useState(3);
	const [restricciones, setRestricciones] = useState(2);
	const [resultado, setResultado] = useState<resultado>();

	const calcular = (data: formData) => {
		// console.log(data);

		let m: number[][] = [...Array(restricciones)].map((_) => [
			...Array(variables),
		]);

		// console.log(m);

		let restrictions: string[] = [];

		for (let i = 0; i < restricciones; i++) {
			restrictions.push(data[`row-${i}-restriction`]);

			for (let j = 0; j < variables; j++) {
				m[i][j] = Number(data[`row-${i}-val-${j}`]);
			}
		}

		//Build row headers and column headers

		let rowHeaders: string[] = [];
		let r = 0;
		let s = 0;

		for (let restriction of restrictions) {
			if (restriction == '<=') {
				s++;
				rowHeaders.push(`s${s}`);
			}
			if (restriction == '>=') {
				r++;
				rowHeaders.push(`r${r}`);
			}
		}
		rowHeaders.push('z');

		let columnHeaders: string[] = [];
		columnHeaders = [...Array(variables)].map((_, i) => `x${i + 1}`);

		columnHeaders.push(...[...Array(s)].map((_, i) => `s${i + 1}`));
		columnHeaders.push(...[...Array(r)].map((_, i) => `e${i + 1}`));
		columnHeaders.push(...[...Array(r)].map((_, i) => `r${i + 1}`));

		//Dinamically build the rest of the matrix

		rowHeaders.slice(0, -1).forEach((rowHeader, i) => {
			columnHeaders.slice(variables).forEach((columnHeader, j) => {
				if (rowHeader === columnHeader) {
					m[i].push(1);
				} else if (
					rowHeader[0] == 'r' &&
					columnHeader[0] == 'e' &&
					rowHeader[1] == columnHeader[1]
				) {
					m[i].push(-1);
				} else {
					m[i].push(0);
				}
			});

			//Then add result
			m[i].push(Number(data[`row-${i}-result`]));
		});

		// console.log(rowHeaders.slice(0, -1), columnHeaders.slice(variables));

		// console.log(m);

		// Finally add row R

		let rowR: number[] = columnHeaders.map((header) =>
			header[0] === 'r' ? -1 : 0
		);
		console.log(rowR);

		m.push([...rowR, 0]);

		console.log(m);

		// console.log(columnHeaders);
		// console.log(rowHeaders, columnHeaders);

		// At this point the matrix generation is ok

		// NOW THIS IS STUPID BUT I WILL ROTATE THE MATRIX, I ALREAD DID THE CODE THAT WAY

		let newMatrix: number[][] = [];

		for (let i = 0; i < m[0].length; i++) {
			let subArr: number[] = [];
			for (let j = 0; j < m.length; j++) {
				subArr.push(m[j][i]);
			}
			newMatrix.push(subArr);
		}

		let rowZ = [...Array(variables)].map(
			(_, i) => Number(data[`fn-val-${i}`]) * -1
		);

		rowZ.push(...[...Array(s)].map((_) => 0));
		//The quantity of e
		rowZ.push(...[...Array(r)].map((_) => 0));
		//Res column
		rowZ.push(0);

		let RvarsIndxs = [];
		for (let i = columnHeaders.length - r; i < columnHeaders.length; i++) {
			RvarsIndxs.push(i);
		}

		let varsIndxs = [...Array(variables)].map((_, i) => i);

		// the recipe is complete, incredibly unreadable and stupid code, if it works I wont move anything of it

		let res = simplex(
			newMatrix,
			RvarsIndxs,
			varsIndxs,
			rowZ,
			columnHeaders,
			rowHeaders
		);

		for (let header of columnHeaders) {
			if (!(header in res)) {
				res[header] = 0;
			}
		}

		setResultado(res);
	};

	return (
		<div>
			hola
			<form onSubmit={handleSubmit(calcular)}>
				<div
					css={css`
						display: flex;
						gap: 1rem;
						align-items: center;
					`}>
					<select {...register('fn-type')}>
						<option value="min">Min</option>
						<option value="max">Max</option>
					</select>
					<p>Z =</p>
					{[...Array(variables)].map((_, i) => (
						<div
							css={css`
								display: flex;
								align-items: center;
							`}>
							<p>+</p>
							<label>
								<input type="text" {...register(`fn-val-${i}`)} />x{i + 1}
							</label>
						</div>
					))}
				</div>

				{[...Array(restricciones)].map((_, i) => (
					<div
						css={css`
							display: flex;
							gap: 1rem;
							align-items: center;
						`}>
						{[...Array(variables)].map((_, j) => (
							<div
								css={css`
									display: flex;
									align-items: center;
								`}>
								<p>+</p>
								<label>
									<input type="text" {...register(`row-${i}-val-${j}`)} />x
									{j + 1}
								</label>
							</div>
						))}

						<select {...register(`row-${i}-restriction`)}>
							<option value="<=">&lt;=</option>
							<option value=">=">&gt;=</option>
							<option value="==">==</option>
						</select>

						<label>
							<input type="text" {...register(`row-${i}-result`)} />
						</label>
					</div>
				))}

				<button type="submit">Resolver</button>
			</form>
			{resultado && JSON.stringify(resultado)}
		</div>
	);
};

export default IndexPage;
