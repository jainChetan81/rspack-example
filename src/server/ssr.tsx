import { ChunkExtractor } from "@loadable/server";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import NodeFS from "node:fs/promises";
import path from "path";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { renderRoutes } from "react-router-config";
import { StaticRouter } from "react-router-dom";

import routes from "../routes";
import renderHtml from "./renderHtml";

async function loadStats(filepath: string) {
  const stats = JSON.parse(await NodeFS.readFile(filepath, "utf-8"));
  if (stats.namedChunkGroups) {
    for (const key in stats.namedChunkGroups) {
      if (stats.namedChunkGroups.hasOwnProperty(key)) {
        const item = stats.namedChunkGroups[key];
        item.childAssets = item.childAssets || {};
      }
    }
  }
  return stats;
}

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {
    // Load data from server-side first

    const statsFile = path.resolve(process.cwd(), "public/loadable-stats.json");
    const extractor = new ChunkExtractor({
      stats: await loadStats(statsFile),
    });

    const staticContext: Record<string, any> = {};
    {/* Setup React-Router server-side rendering */ }
    const App = extractor.collectChunks(
      <StaticRouter location={req.path} context={staticContext} >
        {renderRoutes(routes)}
      </StaticRouter >
    );

    const htmlContent = renderToString(App);
    // head must be placed after "renderToString"
    // see: https://github.com/nfl/react-helmet#server-usage
    const head = Helmet.renderStatic();

    // Check if the render result contains a redirect, if so we need to set
    // the specific status and redirect header and end the response
    if (staticContext.url) {
      res.status(301).setHeader("Location", staticContext.url);
      res.end();

      return;
    }

    // Pass the route and initial state into html template, the "statusCode" comes from <NotFound />
    res
      .status(staticContext.statusCode === "404" ? 404 : 200)
      .send(renderHtml(head, extractor, htmlContent));
  } catch (error) {
    res.status(404).send("Not Found :(");
    console.error(chalk.red(`==> 😭  Rendering routes error: ${error}`));
  }

  next();
};
