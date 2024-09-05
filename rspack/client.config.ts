import path from "path";
import rspack, { Configuration } from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";
import merge from "webpack-merge";

import baseConfig, { isDev } from "./base.config";

const config: Configuration = {
	devtool: isDev && "eval-cheap-source-map",
	entry: isDev ? ["webpack-hot-middleware/client?reload=true", "./src/client"] : "./src/client",
	output: {
		filename: isDev ? "[name].js" : "[name].[contenthash].js",
		chunkFilename: isDev ? "[id].js" : "[id].[contenthash].js",
		path: path.resolve(process.cwd(), "public/assets"),
		publicPath: "/assets/",
		cssFilename: isDev ? "css/[name].css" : "css/[name].[contenthash].css",
		cssChunkFilename: isDev ? "css/[id].css" : "css/[id].[contenthash].css"
	},
	optimization: {
		minimizer: [new rspack.LightningCssMinimizerRspackPlugin()]
	},
	plugins: [
		new rspack.CssExtractRspackPlugin({
			// Don't use hash in development, we need the persistent for "renderHtml.ts"
			filename: isDev ? "css/[name].css" : "css/[name].[contenthash].css",
			chunkFilename: isDev ? "css/[id].css" : "css/[id].[contenthash].css",
			ignoreOrder: true
		}),
		new rspack.HotModuleReplacementPlugin(),
		isDev && new ReactRefreshPlugin()
	].filter(Boolean)
};

export default merge(baseConfig(true), config);
