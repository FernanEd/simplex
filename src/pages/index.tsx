import React, { useEffect, useState } from 'react';
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

	const [variables, setVariables] = useState(2);
	const [restricciones, setRestricciones] = useState(2);
	const [resultado, setResultado] = useState<resultado>();

	const calcular = (data: formData) => {
		console.log(data);

		// BUILDING HEADERS
		let restrictions = [...Array(restricciones)].map(
			(_, i) => data[`row-${i}-restriction`]
		);

		let s = restrictions.filter((restriction) => restriction == '<=').length;
		let r = restrictions.filter((restriction) => restriction == '>=').length;

		let columnHeaders: string[] = [
			...[...Array(variables)].map((_, i) => `x${i + 1}`),
			...[...Array(s)].map((_, i) => `s${i + 1}`),
			...[...Array(r)].map((_, i) => `e${i + 1}`),
			...[...Array(r)].map((_, i) => `r${i + 1}`),
			'res',
		];

		let rowHeaders: string[] = [
			...[...Array(s)].map((_, i) => `s${i + 1}`),
			...[...Array(r)].map((_, i) => `r${i + 1}`),
			'z',
		];

		console.log(columnHeaders, rowHeaders);

		// BUILDING MATRIX

		let m: number[][] = [];
		for (let i = 0; i < rowHeaders.length - 1; i++) {
			let row = [];

			//Add values
			for (let j = 0; j < variables; j++) {
				row.push(Number(data[`row-${i}-val-${j}`]));
			}
			// Add s
			for (let j = 0; j < s; j++) {
				let offset = variables;
				row.push(columnHeaders[j + offset] == `s${i + 1}` ? 1 : 0);
			}
			// Add e
			for (let j = 0; j < r; j++) {
				let offset = variables + s;
				row.push(columnHeaders[j + offset] == `e${i + 1}` ? -1 : 0);
			}
			// Add r
			for (let j = 0; j < r; j++) {
				let offset = variables + s + r;
				row.push(columnHeaders[j + offset] == `r${i + 1}` ? 1 : 0);
			}
			row.push(Number(data[`row-${i}-result`]));
			m.push(row);
		}

		// ADDING ROW Z

		let rowZ = [
			...[...Array(variables)].map((_, i) => Number(data[`fn-val-${i}`]) * -1),
			...[...Array(s)].map((_) => 0),
			...[...Array(r)].map((_) => 0),
			0,
		];

		m.push(rowZ);
		console.log(m);
	};

	return (
		<div>
			<h1>Calculadora Simplex dos fases</h1>

			<button onClick={() => setVariables((prev) => prev + 1)}>
				Agregar variable
			</button>
			<button
				onClick={() => setVariables((prev) => (prev > 1 ? prev - 1 : prev))}>
				Quitar variable
			</button>

			<button onClick={() => setRestricciones((prev) => prev + 1)}>
				Agregar restriccion
			</button>
			<button
				onClick={() =>
					setRestricciones((prev) => (prev > 1 ? prev - 1 : prev))
				}>
				Quitar restriccion
			</button>

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
			{resultado ? (
				<>
					<h2>Resultados:</h2>{' '}
					{Object.keys(resultado).map((key) => (
						<div>
							{key} : {resultado[key]}
						</div>
					))}
				</>
			) : null}
		</div>
	);
};

export default IndexPage;
