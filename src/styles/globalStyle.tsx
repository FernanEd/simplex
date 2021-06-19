import { css, Global } from '@emotion/react';

const color = {
	primary: '#00d',
	secondary: '#888',
	dark: '#333',
	light: '#efefef',
};

const styles = css`
	* {
		margin: 0;
		box-sizing: border-box;
		font-family: 'Roboto mono', monospace;
	}

	html,
	body {
		font-size: 16px;
		color: ${color.dark};

		text-align: center;
	}

	input:not([type='submit']) {
		padding: 0.5rem;
		border: 1px solid ${color.secondary};
		border-radius: 0.125rem;
	}

	input:not([type='submit']):focus {
		outline: 2px solid ${color.primary};
	}

	button,
	input[type='submit'] {
		border: 0;
		border-radius: 0.125rem;
		color: ${color.light};
		background-color: ${color.primary};
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 1rem;
	}

	button:hover,
	input[type='submit']:hover {
		filter: brightness(1.2);
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: 1rem 0;
	}
`;

export default styles;
