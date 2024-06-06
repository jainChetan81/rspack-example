import express from "express";
import logger from "morgan";
import path from "path";
import favicon from "serve-favicon";

import config from "../config";
import ssr from "./ssr";

const app = express();

// Use helmet to secure Express with various HTTP headers

// Use for http request debug (show errors only)
app.use(logger("dev", { skip: (_, res) => res.statusCode < 400 }));
app.use(favicon(path.resolve(process.cwd(), "public/favicon.ico")));
app.use(express.static(path.resolve(process.cwd(), "public")));

// Enable dev-server in development
if (__DEV__) {
	const webpack = require("@rspack/core");
	const webpackConfig = require(`../../rspack/client.config`).default;
	const compiler = webpack(webpackConfig);
	const instance = require("webpack-dev-middleware")(compiler, {
		headers: { "Access-Control-Allow-Origin": "*" },
		serverSideRender: true,
		stats: {
			colors: true,
			hash: false,
			timings: true,
			chunks: false,
			chunkModules: false,
			modules: false
		}
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
}

// Use React server-side rendering middleware
app.get("*", ssr);

// @ts-expect-error
app.listen(config.PORT, config.HOST, (error) => {
	if (error) console.error(`==> 😭  OMG!!! ${error}`);
});
