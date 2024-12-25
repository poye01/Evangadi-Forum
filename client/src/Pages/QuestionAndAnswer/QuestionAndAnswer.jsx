import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../../utility/axios.js";
import styles from "./answer.module.css";
import { MdAccountCircle } from "react-icons/md";
import { UserState } from "../../App.jsx";
import Loader from "../../components/Loader/Loader.jsx"; // Import react spinner
import { ClipLoader } from "react-spinners";
import moment from "moment";
import { useNavigate } from "react-router-dom";
function QuestionAndAnswer() {
  const navigate = useNavigate();
  const [questionDetails, setQuestionDetails] = useState({});
  const userContextData = useContext(UserState);
  const userId = userContextData?.user?.userid;
  const username = userContextData?.user?.username;
  const { questionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [expandedAnswer, setExpandedAnswer] = useState(null); // State to track expanded answers
  const [isPosting, setIsPosting] = useState(false); // State to track posting status
  const answerInput = useRef();
  // Fetch the question details
  useEffect(() => {
    setLoading(true); // Start spinner for loading
    const token = localStorage.getItem("EVANGADI_FORUM_2024");
    axiosInstance
      .get(`/question/${questionId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setQuestionDetails(res.data);
        setLoading(false); // Set loading false after fetching
        // console.log(res.data);
      });
  }, [questionId]);

  // Post a new answer to the question
  async function handlePostAnswer(e) {
    e.preventDefault();
    setIsPosting(true); // Start spinner

    try {
      const token = localStorage.getItem("EVANGADI_FORUM_2024");
      const response = await axiosInstance.post(
        "/answer",
        {
          userid: userId,
          answer: answerInput.current.value,
          questionid: questionId,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (response.status === 201) {
        window.location.reload(); // Reload page on success
      }
    } catch (error) {
      alert(
        error.response.data.message ||
          "An error occurred. Please try again later."
      ); // Fallback error message
    } finally {
      setIsPosting(false); // Stop spinner
    }
  }

  // Function to truncate text after 100 words
  const truncateString = (text, limit = 50) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length > limit) {
      return (
        <>
          {words.slice(0, limit).join(" ")}{" "}
          <span
            style={{
              color: "var(--blue-shade)",
              cursor: "pointer",
            }}
            onClick={() => toggleExpandAnswer(null)} // Function will handle the expansion/collapse
          >
            ... See More
          </span>
        </>
      );
    }
    return text;
  };

  // Toggle expand/collapse for the answer
  const toggleExpandAnswer = (answerId) => {
    if (expandedAnswer === answerId) {
      setExpandedAnswer(null); // Collapse the answer
    } else {
      setExpandedAnswer(answerId); // Expand the answer
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <h1>Question</h1>
          {loading ? (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          ) : (
            <>
              <div style={{ display: "flex" }}>
                <div>
                  <h3 className={styles.questionTitle}>
                    {questionDetails?.title}
                  </h3>
                  <p className={styles.questionDescription}>
                    {questionDetails?.description}
                  </p>
                  <p className={styles.question_date}>
                    Asked by:
                    <span style={{ fontWeight: "600" }}>
                      {" "}
                      {username === questionDetails?.qtn_username
                        ? "you"
                        : questionDetails?.qtn_username}{" "}
                    </span>{" "}
                    <br />
                    {moment(questionDetails.qtn_createdAt)
                      .format("ddd, MMM DD, YYYY h:mm A")
                      .toUpperCase()}
                  </p>
                </div>
              </div>
              <hr />
              <h1
                style={{
                  padding: "5px 0",
                  textAlign: "left",
                  fontWeight: "600",
                }}
              >
                Answers From the Community:
              </h1>
              <hr />
              {/* Display answers */}
              {questionDetails?.answers?.length > 0 ? (
                questionDetails?.answers?.map((answer) => (
                  <div key={answer?.answerid} className={styles.answer_holder}>
                    <div className={styles.account_holder}>
                      <MdAccountCircle size={50} />
                      <div className={styles.profileName}>
                        {username === answer?.username
                          ? "you"
                          : answer?.username}
                      </div>
                    </div>
                    <div
                      className={styles.answerTextContainer}
                      onClick={() => toggleExpandAnswer(answer?.answerid)} // Click on the whole container
                    >
                      <p className={styles.answerText}>
                        {expandedAnswer === answer?.answerid
                          ? answer?.answer
                          : truncateString(answer?.answer)}
                      </p>
                      <p className={styles.answer_date}>
                        {moment(answer?.createdAt)
                          .format("ddd, MMM DD, YYYY h:mm A")
                          .toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    No answers yet!
                  </span>{" "}
                  <br /> Be the first to contribute your answer and help the
                  community.
                </p>
              )}
            </>
          )}
          {/* Form to submit a new answer */}
          <section className={styles.answerFormSection}>
            <h3 className={styles.answerFormTitle}>Answer The Top Question</h3>
            <Link to="/" className={styles.questionPageLink}>
              Go to Question page
            </Link>
            <form onSubmit={handlePostAnswer}>
              <textarea
                placeholder="Your Answer..."
                className={styles.answerInput}
                required
                ref={answerInput}
              />
              <button
                className={styles.postAnswerButton}
                type="submit"
                disabled={isPosting} // Disable button while posting
              >
                {isPosting ? (
                  <ClipLoader size={20} color="#fff" /> // Spinner while loading
                ) : (
                  "Post Your Answer"
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

export default QuestionAndAnswer;
