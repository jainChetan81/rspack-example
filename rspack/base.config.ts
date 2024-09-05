import LoadablePlugin from "@loadable/webpack-plugin";
import rspack, { Configuration, RspackPluginInstance, RuleSetUseItem } from "@rspack/core";
import path from "path";
import { WebpackManifestPlugin } from "rspack-manifest-plugin";

export const isDev = process.env.NODE_ENV === "development";
import LightningCSS from "lightningcss";

const getStyleLoaders = (isWeb: boolean, isSass?: boolean) => {
	let loaders: RuleSetUseItem[] = [
		{
			loader: "css-loader",
			options: {
				importLoaders: isSass ? 2 : 1,
				modules: {
					localIdentName: "[name]__[local]",
					exportOnlyLocals: !isWeb
				}
			}
		},
		{
			loader: "lightningcss-loader",
			options: {
				implementation: LightningCSS
			}
		}
	];
	if (isWeb) loaders = [rspack.CssExtractRspackPlugin.loader, ...loaders];
	if (isSass)
		loaders = [
			...loaders,
			{
				loader: "sass-loader",
				options: {
					implementation: require("sass"),
					additionalData: (...args: any[]) => {
						const themePath = path.resolve(process.cwd(), `src/theme/core.scss`);
						const loaderContext = args[1];
						const data = args[0];
						// More information about available properties https://webpack.js.org/api/loaders/
						const { resourcePath } = loaderContext;
						const relativePath2 = path.relative(resourcePath, themePath).substring(3);
						return `@import "${relativePath2}";${data}`;
					}
				}
			}
		];

	return loaders;
};

const getPlugins = (isWeb: boolean) => {
	let plugins = [
		new rspack.ProgressPlugin(),
		new WebpackManifestPlugin({
			fileName: path.resolve(process.cwd(), "public/webpack-assets.json"),
			filter: (file) => file.isInitial
		}),
		new LoadablePlugin({
			writeToDisk: true,
			filename: "../loadable-stats.json"
		}),
		// Setting global variables
		new rspack.DefinePlugin({
			__CLIENT__: isWeb,
			__SERVER__: !isWeb,
			__DEV__: isDev
		})
	];

	return plugins;
};

const config = (isWeb = false): Configuration => ({
	mode: isDev ? "development" : "production",
	stats: "normal",
	context: path.resolve(process.cwd()),
	experiments: { css: false },
	output: { clean: true },
	optimization: {
		minimizer: [new rspack.SwcJsMinimizerRspackPlugin()],
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
					name: "vendor",
					chunks: "all"
				}
			}
		}
	},
	plugins: getPlugins(isWeb) as RspackPluginInstance[],
	module: {
		rules: [
			{
				test: /\.(t|j)sx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "swc-loader",
						options: rspackSwcConfig
					}
				]
			},
			{
				test: /\.css$/,
				use: getStyleLoaders(isWeb)
			},
			{
				test: /\.(scss|sass)$/,
				use: getStyleLoaders(isWeb, true)
			},
			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				type: "asset",
				generator: { emit: isWeb }
			},
			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				type: "asset",
				generator: { emit: isWeb }
			}
		]
	},
	resolve: {
		modules: ["src", "node_modules"],
		extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
	}
});

export default config;
const rspackSwcConfig = {
	sourceMaps: true,
	jsc: {
		// externalHelpers: The output code depends on helper functions(like browserlist) to support the target environment
		// need to install @swc/helpers to use this feature
		externalHelpers: true,
		parser: {
			syntax: "typescript",
			tsx: true,
			dynamicImport: true
		},
		transform: {
			react: {
				runtime: "automatic"
			}
		},
		experimental: {
			plugins: [["@swc/plugin-loadable-components", {}]]
		}
	},
	env: {
		coreJs: "3.26.1",
		targets: "Chrome >= 48"
	}
};
