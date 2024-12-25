import { useContext } from "react";
import styles from "./home.module.css";
import Questions from "../../components/Question/Questions.jsx";
import { Link } from "react-router-dom";
import { UserState } from "../../App.jsx";

function Home() {
  const userContextData = useContext(UserState);
  const user = userContextData?.user;
  const userName = String(user?.username);

  return (
    <>
      <div className={styles.home_container}>
        <div className={styles.ask_welcome_holder}>
          <div className={styles.ask_question}>
            <Link to="/ask" style={{ textDecoration: "none" }}>
              <button className={styles.ask_btn}>
                <span>Ask a Question</span>
              </button>
            </Link>
          </div>
          <div className={styles.welcome_msg}>
            <p>
              Welcome{" "}
              <span className={styles.userName}>
                {userName.charAt(0).toUpperCase() + userName.slice(1)}
              </span>
            </p>
          </div>
        </div>

        <div className={styles.questions_list}>
          <Questions />
        </div>
      </div>
    </>
  );
}

export default Home;
