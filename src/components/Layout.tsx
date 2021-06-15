import * as React from 'react';
import { css, Global } from '@emotion/react';
import styles from '../styles/globalStyle';

const Layout: React.FunctionComponent = ({ children }) => {
	return (
		<>
			<Global styles={styles} />
			<main
				css={css`
					margin: 1rem;
				`}>
				{children}
			</main>
		</>
	);
};

export default Layout;
