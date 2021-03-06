import { Post, PostBody } from "../../../utils/Post";
import { useEffect } from "react"; 
import { BsSignpostSplitFill } from "react-icons/bs";
import { TbFidgetSpinner } from "react-icons/tb";
import { FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";

import styles from "./Feed.module.scss";


interface FeedProps {
  allPosts: PostBody[];
  isLoading: boolean;
  getRecentPosts: (reset: boolean) => void;
}

export function Feed({ allPosts, isLoading, getRecentPosts }: FeedProps) {
  let delayTime = 0;

  useEffect(() => {
    getRecentPosts(true);
  }, [])

  const { data: session } = useSession();

  return (
    <div className={styles.feed}>

      {
        isLoading
        ? <div className={"loadingContainer"}><FaSpinner className={styles.spin} /></div>
        : <></>
      }

      <h2 className={styles.title}>Últimas postagens</h2>

      <hr className={styles.division} />

      {
        allPosts.length === 0
        ? (
          <div className={styles.notHavePosts}><BsSignpostSplitFill /> Nenhum post encontrado</div>
        ) : (
          allPosts.map(post => {
            delayTime == 5 ? delayTime = 0 : delayTime++;
            
            return (
              <Post
                key={post.id}
                data={post}
                currentUserId={session?.user?.id}
                time={750*delayTime}
              />
            )
          })
        )
      }

      <div className={styles.loadMorePosts}>
        <button  
          className="loadingContainer" 
          onClick={() => !isLoading ? getRecentPosts(false) : null}
          disabled={isLoading}
        >
          Carregar mais posts {isLoading ? <TbFidgetSpinner /> : <></>}
        </button>
      </div>

    </div>
  );
}