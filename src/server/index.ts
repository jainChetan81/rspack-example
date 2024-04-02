import express from "express";
import logger from "morgan";
import path from "path";
import favicon from "serve-favicon";

import config from "../config";
import devServer from "./devServer";
import ssr from "./ssr";

const app = express();

// Use helmet to secure Express with various HTTP headers

// Use for http request debug (show errors only)
app.use(logger("dev", { skip: (_, res) => res.statusCode < 400 }));
app.use(favicon(path.resolve(process.cwd(), "public/favicon.ico")));
app.use(express.static(path.resolve(process.cwd(), "public")));

// Enable dev-server in development
if (__DEV__) devServer(app);

// Use React server-side rendering middleware
app.get("*", ssr);

// @ts-expect-error
app.listen(config.PORT, config.HOST, (error) => {
	if (error) console.error(`==> 😭  OMG!!! ${error}`);
});
