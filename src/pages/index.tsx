import React, { useState } from 'react';
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';

interface formData {
	[x: string]: string;
}

const IndexPage: React.FunctionComponent = () => {
	const { register, handleSubmit } = useForm();

	const [variables, setVariables] = useState(3);
	const [restricciones, setRestricciones] = useState(2);

	const calcular = (data: formData) => {
		console.log(data);

		let m: number[][] = [...Array(restricciones)].map((_) => [
			...Array(variables),
		]);

		console.log(m);

		let restrictions: string[] = [];

		for (let i = 0; i < restricciones; i++) {
			restrictions.push(data[`row-${i}-restriction`]);

			for (let j = 0; j < variables; j++) {
				m[i][j] = Number(data[`row-${i}-val-${j}`]);
			}
		}

		//build headers

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
		columnHeaders.push(...[...Array(s)].map((_, i) => `s${i + 1}`));

		console.log(columnHeaders);
		console.log(rowHeaders, columnHeaders);
	};

	return (
		<div>
			hola
			<form onSubmit={handleSubmit(calcular)}>
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
								<label>
									x{j + 1}
									<input type="text" {...register(`row-${i}-val-${j}`)} />
								</label>
								<p>+</p>
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
		</div>
	);
};

export default IndexPage;
