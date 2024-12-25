import { useContext, useRef, useState } from "react";
import classes from "./askQuestion.module.css";
import { axiosInstance } from "../../utility/axios.js";
import { Link, useNavigate } from "react-router-dom";
import { UserState } from "../../App.jsx";
import ClipLoader from "react-spinners/ClipLoader";
import { GoDotFill } from "react-icons/go";
function AskQuestion() {
  const navigate = useNavigate();
  const userContextData = useContext(UserState);
  const user = userContextData?.user;
  const titleDom = useRef();
  const descriptionDom = useRef();
  const [isPosting, setIsPosting] = useState(false); // State for loading spinner
  const userId = user?.userid;

  async function handleSubmit(e) {
    e.preventDefault();
    setIsPosting(true); // Start spinner

    const title = titleDom.current.value;
    const description = descriptionDom.current.value;
    const userid = userId;
    const tag = "General";

    try {
      const token = localStorage.getItem("EVANGADI_FORUM_2024");
      const response = await axiosInstance.post(
        "/question",
        {
          userid,
          title,
          description,
          tag,
        }, // This is the request body
        {
          headers: { Authorization: "Bearer " + token }, // This is the config object
        }
      );

      if (response.status === 201) {
        // console.log("Question created successfully");
        navigate("/");
      }
    } catch (error) {
      // console.error(error);
      alert("Failed to create question. Please try again later.");
    } finally {
      setIsPosting(false); // Stop spinner
    }
  }

  return (
    <>
      <div className={classes.allContainer}>
        <div className={classes.question__container}>
          <div className={classes.question__wrapper}>
            <h3 className={classes.question__header__title}>
              <span className={classes.highlight}>
                Steps to write a good question
              </span>
            </h3>

            <div className={classes.questionContainer}>
              <div className={classes.questionList}>
                <ul className={classes.questionListUl}>
                  <li className={classes.questionItem}>
                    <span className={classes.icon}>
                      <GoDotFill />
                    </span>
                    Summarize your problem in a one-line title.
                  </li>
                  <li className={classes.questionItem}>
                    <span className={classes.icon}>
                      <GoDotFill />
                    </span>
                    Describe your problem in more detail.
                  </li>
                  <li className={classes.questionItem}>
                    <span className={classes.icon}>
                      <GoDotFill />
                    </span>
                    Explain what you have tried and what you expected to happen.
                  </li>
                  <li className={classes.questionItem}>
                    <span className={classes.icon}>
                      <GoDotFill />
                    </span>
                    Review your question and post it to the site.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <h4 className={classes.highlight}>Ask a public question</h4>
          <Link to="/" className={classes.questionPageLink}>
            Go to Question page
          </Link>
          <div className={classes.question__header__titleTwo}>
            <form onSubmit={handleSubmit} className={classes.question__form}>
              <input
                className={classes.question__title2}
                ref={titleDom}
                type="text"
                placeholder="Question title"
                required
              />
              <textarea
                rows={4}
                className={classes.question__description}
                ref={descriptionDom}
                type="text"
                placeholder="Question Description..."
                required
              />
              <div className={classes.buttonContainer}>
                <button
                  className={classes.question__button}
                  type="submit"
                  disabled={isPosting} // Disable button while posting
                >
                  {isPosting ? (
                    <ClipLoader size={20} color="#fff" /> // Spinner while loading
                  ) : (
                    "Post Question"
                  )}
                </button>
                <Link to="/">
                  <button className={classes.question__btn} type="button">
                    Back to Home
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default AskQuestion;
