import { useEffect, memo, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";

import { User, getUserData } from "../../services/jsonPlaceholder";
import { Info } from "../../components";
import styles from "./styles.module.scss";

export type Props = RouteComponentProps<{ id: string }>;
interface UserDate {
  [id: string]: {
    readyStatus: string;
    item?: User;
    error?: string;
  };
}
const UserInfo = ({ match }: Props): JSX.Element => {
  const { id } = match.params;
  const [userData, setUserData] = useState<User | null>()
  const [readyStatus, setReadyStatus] = useState<"request" | "failure" | "success">("request")

  async function fetchO() {
    const { data, error } = await getUserData(id);
    if (error || !data) {
      return setReadyStatus("failure")
    }
    setReadyStatus("success")
    setUserData(data)
  }
  useEffect(() => {
    fetchO()
  }, [id]);

  const renderInfo = () => {

    if (!userData || readyStatus === "request")
      return <p>Loading...</p>;

    if (readyStatus === "failure")
      return <p>Oops! Failed to load data.</p>;
    const userInfo = userData;

    return <Info item={userInfo as User} />;
  };

  return (
    <div className={styles.UserInfo}>
      <Helmet title="User Info" />
      {renderInfo()}
    </div>
  );
};


export default memo(UserInfo);
