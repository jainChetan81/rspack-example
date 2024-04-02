import { RouteConfig } from "react-router-config";

import App from "../app";
import AsyncHome from "../pages/Home";
import AsyncUserInfo from "../pages/UserInfo";
import NotFound from "../pages/NotFound";

export default [
	{
		component: App,
		routes: [
			{
				path: "/",
				exact: true,
				component: AsyncHome // Add your page here
			},
			{
				path: "/UserInfo/:id",
				component: AsyncUserInfo
			},
			{
				component: NotFound
			}
		]
	}
] as RouteConfig[];
