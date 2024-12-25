import styles from "./questionCard.module.css";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import moment from "moment";
import { UserState } from "../../App";
import { useContext } from "react";
function QuestionCard({
  id,
  userName,
  questionTitle,
  description,
  question_date,
}) {
  const userContextData = useContext(UserState);
  const username = userContextData?.user?.username;
  const formattedDate = moment(question_date)
    .format("ddd, MMM DD, YYYY h:mm A")
    .toUpperCase();

  const truncateString = (questionTitle, size) => {
    const title = String(questionTitle);
    if (title.length > size) {
      return title.substring(0, size).concat(". . .");
    }
    return title;
  };
  return (
    <Link to={`/question/${id}`}>
      <div className={styles.question_holder}>
        <div className={styles.requester_question_holder}>
          <div className={styles.requester_holder}>
            <MdAccountCircle size={50} />
            <div>{username === userName ? "you" : userName}</div>
          </div>

          <div className={styles.title_description_holder}>
            <p className={styles.question_title}>
              {truncateString(questionTitle, 100)}
            </p>
            <p className={styles.question_description}>
              {truncateString(description, 300)}
            </p>
            <p className={styles.question_date}>{formattedDate}</p>
          </div>
        </div>

        <div className={styles.question_arrow_holder}>
          <div>
            <FaChevronRight size={23} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default QuestionCard;
