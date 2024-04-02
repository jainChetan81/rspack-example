import loadable from "@loadable/component";

import { ErrorBoundary, Loading } from "../../components";
import { Props } from "./Home";

const Home = loadable(() => import("./Home"), {
  fallback: <Loading />,
});

export default (props: Props): JSX.Element => (
  <ErrorBoundary>
    <Home {...props} />
  </ErrorBoundary>
);
