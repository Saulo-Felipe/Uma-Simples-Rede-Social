import { Post } from "../../../utils/Post";
import { AiOutlineLoading } from "react-icons/ai";
import { useEffect, useState } from "react"; 
import { api } from "../../../../services/api";

import styles from "./Feed.module.scss";

export function Feed({ allPosts, setAllPosts, isLoading, setIsLoading }) {

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let { data } = await api.post("/getRecentPosts");
      setIsLoading(false);

      if (data.success) {
        let posts = [];
  
        for (let i = 0; i < data.posts.length; i++) {
          posts.push({
            username: data.posts[i].username,
            user_picture: data.posts[i].image_url,
            post: {
              content: data.posts[i].content,
            }
          });
        }
  
        setAllPosts(posts);
      }
    })();

  }, [])
  return (
    <div className={styles.feed}>

      {
        isLoading
        ? <div className={styles.loadingContainer}><AiOutlineLoading /></div>
        : <></>
      }

      <h1 className={styles.title}>Últimas postagens</h1>
      {
        allPosts.map((post, index) =>
          <Post
            key={index}
            userName={post.username}
            userPicture={post.user_picture}
            content={post.post.content}
          />
        )
      }
    </div>
  );
}