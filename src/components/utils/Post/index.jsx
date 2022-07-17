import { useEffect, useState } from "react";
import { api } from "../../../services/api";

import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { CgSpinnerTwo } from "react-icons/cg";

import Link from "next/link";
import Image from "next/image";


import styles from "./Post.module.scss";

export function Post({ data: postInfo, time, currentUserId }) {
  const [loadingLike, setLoadingLike] = useState(true);
  const {
    id,
    content,
    created_on,
    fk_user_id,
    image_url,
    dislikes_amount,
    likes_amount,
    username
  } = postInfo;

  const [action, setAction] = useState({
    isLike: false,
    isDislike: false,
    userAction: 0,
    likeAmount: Number(likes_amount),
    dislikeAmount: Number(dislikes_amount)
  });

  useEffect(() => {
    setLoadingLike(true);
    console.log("ID recebido: ", currentUserId)

    setTimeout(async () => {
      const {data} = await api.post("/userLikedPost", { postID: id, userID: currentUserId });

      setLoadingLike(false);

      if (data.type === "like") {
        setAction({ ...action, isLike: true, userAction: 1 });
      } else if (data.type === "dislike") {
        setAction({ ...action, isDislike: true, userAction: 2 });
      }

    }, time);
  }, [])

  function handleLike(type) {
    if (!loadingLike) {
      if (type === "mouseEnter") {
        setAction({ ...action, isLike: true });
      }
      else if (action.userAction !== 1) {
        setAction({ ...action, isLike: false });
      }      
    }
  }

  function handleDislike(type) {
    if (!loadingLike) {

      if (type === "mouseEnter") {
        setAction({ ...action, isDislike: true });
      }
      else if (action.userAction != 2) {
        setAction({ ...action, isDislike: false });
      }
    }
  }

  async function handleNewLike() {
    if (!loadingLike) {
      console.log("New like")
      const oldUserAction = action.userAction;

      if (action.userAction == 1) { // Remove like
        setAction({ 
          isLike: false,
          isDislike: false,
          userAction: 0,
          likeAmount: action.likeAmount-1,
          dislikeAmount: action.dislikeAmount
        });

        const { data } = await api.post("/deleteAction", {
          userID: currentUserId,
          postID: id,
          action: "Like"
        });

        console.log("remove Like aprovado")

        if (!data.success) {
          setAction({ 
            isLike: true,
            isDislike: false,
            userAction: oldUserAction,
            likeAmount: action.likeAmount+1,
            dislikeAmount: action.dislikeAmount
          });

          alert("Ocorreu um erro ao remover curtida")
        }

      } else { // Add like
        setAction({ 
          isLike: true,
          isDislike: false,
          userAction: 1,
          likeAmount: action.likeAmount+1,
          dislikeAmount: oldUserAction == 2 ? action.dislikeAmount-1 : action.dislikeAmount
        });

        const { data } = await api.post(`/newAction`, {
          userID: currentUserId,
          postID: id,
          action: "Like",
          deleteOthers: oldUserAction == 2
        });

        console.log("Like aprovado");

        if (!data.success) { // Error
          setAction({ 
            isLike: false,
            isDislike: oldUserAction == 2,
            userAction: oldUserAction,
            likeAmount: action.likeAmount-1,
            dislikeAmount: oldUserAction == 2 ? action.dislikeAmount+1 : action.dislikeAmount
          });

          alert("Erro ao adicionar curtida");
        }
      }
    }
  }

  async function handleNewDislike() {
    if (!loadingLike) {
      console.log("New dislike");
      const oldUserAction = action.userAction;

      if (action.userAction == 2) { // Remove dislike
        setAction({ 
          isLike: false,
          isDislike: false,
          userAction: 0,
          likeAmount: action.likeAmount,
          dislikeAmount: action.dislikeAmount-1 
        });

        const { data } = await api.post("/deleteAction", {
          userID: currentUserId,
          postID: id,
          action: "Dislike"
        });

        console.log("remove Dislike aprovado")

        if (!data.success) { // error
          setAction({ 
            isLike: false,
            isDislike: true,
            userAction: oldUserAction,
            likeAmount: action.likeAmount,
            dislikeAmount: action.dislikeAmount+1
          });

          alert("Ocorreu um erro ao remover curtida")
        }

      } else { // Add dislike
        setAction({ 
          isLike: false,
          isDislike: true,
          userAction: 2,
          likeAmount: oldUserAction == 1 ? action.likeAmount-1 : action.likeAmount,
          dislikeAmount: action.dislikeAmount+1
        })

        const { data } = await api.post(`/newAction`, {
          userID: currentUserId,
          postID: id,
          action: "Dislike",
          deleteOthers: oldUserAction == 1
        });

        console.log("Dislike aprovado")

        if (!data.success) {
          setAction({ 
            isLike: oldUserAction == 1,
            isDislike: false,
            userAction: oldUserAction,
            likeAmount: oldUserAction == 1 ? action.likeAmount+1 : action.likeAmount,
            dislikeAmount: action.dislikeAmount-1 
          })

          alert("Erro ao adicionar curtida")
        }
      }

    }
  }


  return (
    <div className={styles.post}>
      <header>
        <div className={styles.profilePictureContainer}>
          <Image
            alt={"user profile"}
            src={image_url}
            width={"100%"}
            height={"100%"}
          />
        </div>

        <div className={styles.username}>
          <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${fk_user_id}`}>
            <a>
              {username}
            </a>
          </Link>
        </div>
      </header>

      <hr />

      <section className={styles.postContainer}>
        { content }
      </section>

      <footer>
        <div>
          <div className={styles.like}
            onMouseEnter={() => handleLike("mouseEnter")}
            onMouseLeave={() => handleLike("mouseLeave")}
            onClick={handleNewLike}
          >
            {
              loadingLike
              ? (
                <div style={{ color: "gray" }}>
                  <AiOutlineLike style={{ color: "gray" }} /> 0
                </div>
              ) : (
                <>
                  { action.isLike ? <AiFillLike  /> : <AiOutlineLike /> }
                  { action.likeAmount }
                </>
              )
            }
          </div>

          <div
            className={styles.dislike}
            onMouseEnter={() => handleDislike("mouseEnter")}
            onMouseLeave={() => handleDislike("mouseLeave")}
            onClick={handleNewDislike}
          >
            {
              loadingLike
              ? (
                <div style={{ color: "gray" }}>
                  <AiFillDislike style={{ color: "gray" }} /> 0
                </div>
              ) : (
                <>
                  { action.isDislike ? <AiFillDislike  /> : <AiOutlineDislike /> }
                  { action.dislikeAmount }
                </>
              )
            }
          </div>
        </div>

        <div className={styles.publicationDate}>
          {
            created_on.replace(",", "/").replace(",", "/").replace(",", " às " )
          }
        </div>
      </footer>
    </div>
  );
}