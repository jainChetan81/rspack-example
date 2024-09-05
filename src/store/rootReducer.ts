import { History } from "history";

import userList from "./userList";
import userData from "./userData";

// Use inferred return type for making correctly Redux types
export default (history: History) => ({
  userList,
  userData,
  // Register more reducers...
});
