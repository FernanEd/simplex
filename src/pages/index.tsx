import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import simplexMethod from '../utils/simplexMethod';

import { Helmet } from 'react-helmet';

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
	const [ecuaciones, setEcuaciones] = useState<Array<string>>();

	const calcular = (data: formData) => {
		console.log(data);

		// BUILDING HEADERS
		let restrictions = [...Array(restricciones)].map(
			(_, i) => data[`row-${i}-restriction`]
		);

		let s = 0;
		let r = 0;

		let rowHeaders: string[] = [];

		for (let restriction of restrictions) {
			if (restriction == '<=') {
				s++;
				rowHeaders.push(`s${s}`);
			} else {
				r++;
				rowHeaders.push(`r${r}`);
			}
		}
		rowHeaders.push('z');

		let columnHeaders: string[] = [
			...[...Array(variables)].map((_, i) => `x${i + 1}`),
			...[...Array(s)].map((_, i) => `s${i + 1}`),
			...[...Array(r)].map((_, i) => `e${i + 1}`),
			...[...Array(r)].map((_, i) => `r${i + 1}`),
			'res',
		];

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
				let alignment = rowHeaders[i] === columnHeaders[j + offset];
				row.push(alignment ? 1 : 0);
			}

			// Add e
			for (let j = 0; j < r; j++) {
				let offset = variables + s;
				let alignment =
					rowHeaders[i] == columnHeaders[j + offset].replace('e', 'r');

				row.push(alignment ? -1 : 0);
			}

			// Fill r squares
			for (let j = 0; j < r; j++) {
				let offset = variables + s + r;
				let alignment = rowHeaders[i] === columnHeaders[j + offset];
				row.push(alignment ? 1 : 0);
			}
			row.push(Number(data[`row-${i}-result`]));

			m.push(row);
		}

		// ADDING ROW Z

		let rowZ = [
			...[...Array(variables)].map((_, i) => Number(data[`fn-val-${i}`]) * -1),
			...[...Array(s)].map((_) => 0),
			...[...Array(r)].map((_) => 0),
			...[...Array(r)].map((_) => 0),
			0,
		];

		m.push(rowZ);

		// console.log(m, data['fn-type']);
		// console.log(m, columnHeaders, rowHeaders);

		let result = simplexMethod({
			matrix: m,
			columnHeaders,
			rowHeaders,
			fnZ: data['fn-type'],
		});

		//Those not included are 0
		for (let header of columnHeaders.slice(0, -1)) {
			if (!(header in result)) {
				result[header] = 0;
			}
		}

		// console.log(result);

		setResultado(result);

		// CODIGO PARA SACAR LAS ECUACIONES

		let ecuaciones = [];

		for (let i = 0; i < rowHeaders.length; i++) {
			let ecuacion = [];
			for (let j = 0; j < columnHeaders.length; j++) {
				let columnHeader = columnHeaders[j];
				let coeficient = Number(m[i][j]);

				if (columnHeader == 'res') {
					columnHeader = '';
				}

				if (coeficient !== 0) {
					if (coeficient == 1) {
						ecuacion.push(`${columnHeader}`);
					} else if (coeficient == -1) {
						ecuacion.push(`-${columnHeader}`);
					} else {
						ecuacion.push(`${coeficient}${columnHeader}`);
					}
				} else {
					if (columnHeaders[j] == 'res') {
						ecuacion.push(coeficient);
					}
				}
			}

			ecuaciones.push(ecuacion.join('+').replace(/\+(?=[\d]+$)/, '='));
		}

		// SUSTITUIR LA ULTIMA ECUACIÓN POR LA Z

		let ecuacionZ = ecuaciones[ecuaciones.length - 1];
		ecuacionZ = 'Z' + ecuacionZ;
		ecuaciones[ecuaciones.length - 1] = ecuacionZ;

		setEcuaciones(ecuaciones);
	};

	return (
		<Layout>
			<Helmet title="Calculadora Simplex" />
			<h1>Calculadora Simplex</h1>

			<section
				css={css`
					margin: 1rem 0;
					display: flex;
					gap: 1rem;
					justify-content: center;
					align-items: center;
				`}>
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
			</section>

			<form
				onSubmit={handleSubmit(calcular)}
				css={css`
					margin: auto;
					display: inline-block;
				`}>
				<h2>Función Objetivo</h2>
				<div
					css={css`
						margin: 1rem 0;
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
							`}
							key={i}>
							<p>+</p>
							<label>
								<input type="text" {...register(`fn-val-${i}`)} />x{i + 1}
							</label>
						</div>
					))}
				</div>

				<hr />

				<h2>Restricciones</h2>
				{[...Array(restricciones)].map((_, i) => (
					<div
						css={css`
							margin: 1rem 0;
							display: flex;
							gap: 1rem;
							align-items: center;
						`}
						key={i}>
						<p>r{i + 1})</p>
						{[...Array(variables)].map((_, j) => (
							<div
								css={css`
									display: flex;
									align-items: center;
								`}
								key={`${i}-${j}`}>
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

				<hr />
				<br />
				<button type="submit">Resolver</button>
			</form>

			<section
				css={css`
					margin: 1rem;
				`}>
				{ecuaciones && (
					<>
						<h2>Forma canonica:</h2>{' '}
						{ecuaciones.map((ecuacion) => (
							<div key={ecuacion}>{ecuacion}</div>
						))}
					</>
				)}
				{resultado && (
					<>
						<h2>Resultados:</h2>{' '}
						{Object.keys(resultado).map((key, i) => (
							<div key={`${key}-${i}`}>
								{key} : {resultado[key]}
							</div>
						))}
					</>
				)}
			</section>
		</Layout>
	);
};

export default IndexPage;
