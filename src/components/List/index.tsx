import { memo } from "react";
import { Link } from "react-router-dom";

import { User } from "../../services/jsonPlaceholder";
import themeVariable from "../../theme/exportColor.scss";
import styles from "./styles.module.scss";

interface Props {
  items: User[];
}

const List = ({ items }: Props) => (
  <div className={styles.UserList}>
    <h4 style={{ color: themeVariable?.red }}>User List</h4>
    <ul>
      {items.map(({ id, name }) => (
        <li key={id}>
          <Link to={`/UserInfo/${id}`}>{name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default memo(List);
