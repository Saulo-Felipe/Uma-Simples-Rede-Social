import { NewPost } from "../../components/NewPost";
import { OnlineUsers } from "../../components/OnlineUsers";
import { Posts } from "../../components/Posts";

import styles from "./styles.module.scss";

export default function Home() {

  

  return (
    <>
      <main className={styles.homeMain}>
        <div className={styles.feed}>
          <NewPost />

          <div className={styles.postsContent}>
            <Posts />
          </div>

        </div>

        <div className={styles.lateralUsers}>
          <OnlineUsers />
        </div>
      </main>
    </>
  );
}
