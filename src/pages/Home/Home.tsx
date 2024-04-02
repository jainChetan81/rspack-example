import { FC, memo, useState } from "react";
import { RouteComponentProps } from "react-router-dom";

import styles from "./styles.module.scss";


export type Props = RouteComponentProps;

const Home: FC<Props> = (): JSX.Element => {

  const [readyStatus, setReadyStatus] = useState("")
  const [items, setItems] = useState<any[]>([])

  // async function fetchO() {
  //   setReadyStatus("request")
  //   const { error, data } = await getUserList();
  //   if (error) {
  //     setReadyStatus("invalid")
  //   } else if (data) {
  //     console.log('here');

  //     setItems(data)
  //     setReadyStatus("success")
  //   }

  // }

  // // Fetch client-side data here
  // useEffect(() => {
  //   console.log('here');

  //   fetchO()
  // }, []);

  const renderList = () => {
    if (!readyStatus || readyStatus === "invalid" || readyStatus === "request")
      return <p>Loading...</p>;

    if (readyStatus === "failure") return <p>Oops, Failed to load list!</p>;

    // return <List items={items} />;
  };

  return (
    <div className={styles.Home}>
      {/* <Helmet title="Home" /> */}
      {renderList()}
    </div>
  );
};


export default memo(Home);
