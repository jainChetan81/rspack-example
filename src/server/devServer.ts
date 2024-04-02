import { Express } from "express";

import config from "../config";

export default (app: Express): void => {
	const webpack = require("@rspack/core");
	const webpackConfig = require(`../../rspack/client.config`).default;
	const compiler = webpack(webpackConfig);
	const instance = require("webpack-dev-middleware")(compiler, {
		headers: { "Access-Control-Allow-Origin": "*" },
		serverSideRender: true
	});

	app.use(instance);
	app.use(
		require("webpack-hot-middleware")(compiler, {
			log: false,
			path: "/__webpack_hmr",
			heartbeat: 10 * 1000
		})
	);

	instance.waitUntilValid(() => {
		const url = `http://${config.HOST}:${config.PORT}`;
		console.info(`==> 🌎  Listening at ${url}`);
	});
};
