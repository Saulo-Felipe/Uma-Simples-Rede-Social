import { Users } from "../../components/templates/Search/Users";
import { useRouter } from "next/router"

import styles from "./search.module.scss";

export default function UserName() {
  const { UserName } = useRouter().query;

  return (
    <main className={styles.container}>

      <h2 className={styles.title}>Resultados para &apos;{ UserName }&apos; </h2>

      <hr className={styles.division}/>

      <Users 
        searchQuery={UserName}
      />
    </main>
  );
}