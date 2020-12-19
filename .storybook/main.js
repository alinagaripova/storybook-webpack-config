const path = require('path');

module.exports = {
	stories: ["../src/stories/**/*.stories.js"],
	addons: ["@storybook/addon-actions", "@storybook/addon-links", "@storybook/addon-knobs/register", "@storybook/addon-storysource"],
	webpackFinal: async config => {
		// Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
		config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]

		// use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
		config.module.rules[0].use[0].loader = require.resolve("babel-loader")

		// use @babel/preset-react for JSX and env (instead of staged presets)
		config.module.rules[0].use[0].options.presets = [
			require.resolve("@babel/preset-react"),
			require.resolve("@babel/preset-env"),
		]

		config.module.rules[0].use[0].options.plugins = [
			// use @babel/plugin-proposal-class-properties for class arrow functions
			require.resolve("@babel/plugin-proposal-class-properties"),
			// use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
			require.resolve("babel-plugin-remove-graphql-queries"),
		]

		// Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
		config.resolve.mainFields = ["browser", "module", "main"]

		config.module.rules.push(
			{
				test: /\.(ts|tsx)$/,
				loader: require.resolve("babel-loader"),
				options: {
					presets: [["react-app", { flow: false, typescript: true }]],
					plugins: [
						require.resolve("@babel/plugin-proposal-class-properties"),
						// use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
						require.resolve("babel-plugin-remove-graphql-queries"),
					],
				},
			},
			{
				test: /\.(scss|css)$/,
				use: ['style-loader', 'css-loader', 'sass-loader',
					{
						loader: 'sass-resources-loader',
						options: {
							//shared variable files must be defined here, but only variables. css output will be repeated for every file
							//change file name if you need
							resources: [require.resolve('../src/styles/common.scss')],
						},
					},
				],
				include: path.resolve(__dirname, '../'),
			},
			{
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'sass-loader',
					{
						loader: "less-loader",
						options: {
							lessOptions: {
								paths: ['../src/styles/antd.less'],
								javascriptEnabled: true
							}
						},
					},
				],
				include: path.resolve(__dirname, '../'),
			},
			{
				test: /\.(jpg|png|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							// Inline files smaller than 10 kB
							limit: 10 * 1024
						}
					},
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								enabled: false
								// NOTE: mozjpeg is disabled as it causes errors in some Linux environments
								// Try enabling it in your environment by switching the config to:
								// enabled: true,
								// progressive: true,
							},
							gifsicle: {
								interlaced: false
							},
							optipng: {
								optimizationLevel: 7
							},
							pngquant: {
								quality: [0.65, 0.90],
								speed: 4
							}
						}
					}
				]
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: 'svg-url-loader',
						options: {
							// Inline files smaller than 10 kB
							limit: 10 * 1024,
							noquotes: true
						}
					}
				]
			},
			{
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: "graphql-tag/loader",
			}
			)
		config.resolve.extensions.push(".ts", ".tsx")
		return config
	},
}
