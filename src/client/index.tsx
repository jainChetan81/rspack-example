import { loadableReady } from "@loadable/component";
import ReactDOM from "react-dom";
import { RouteConfig, renderRoutes } from "react-router-config";

import routes from "../routes";

// Get the initial state from server-side rendering

const render = (Routes: RouteConfig[]) =>
  ReactDOM.hydrate(
    renderRoutes(Routes),
    document.getElementById("react-view")
  );

// loadable-component setup
loadableReady(() => render(routes as RouteConfig[]));

/**
 * A temporary workaround for Webpack v5 + HMR, why? see this issue: https://github.com/webpack-contrib/webpack-hot-middleware/issues/390
 */
// @ts-expect-error
if (module.hot) module.hot.accept();
