module.exports = {
	pathPrefix: `/simplex`,
	siteMetadata: {
		title: 'simplex',
	},
	plugins: [
		{
			resolve: `gatsby-plugin-google-fonts`,
			options: {
				fonts: ['Roboto Mono:300,400,700'],
				display: 'swap',
			},
		},
		'gatsby-plugin-emotion',
		'gatsby-plugin-image',
		'gatsby-plugin-react-helmet',
		'gatsby-plugin-sharp',
		'gatsby-transformer-sharp',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: './src/images/',
			},
			__key: 'images',
		},
	],
};
