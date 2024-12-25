import { useEffect, useState } from "react";
import styles from "./questions.module.css";
import { axiosInstance } from "../../utility/axios.js";
import QuestionCard from "../../components/QuestionCard/QuestionCard.jsx";
import Loader from "../../components/Loader/Loader.jsx";

function Question() {
  const [questions, setQuestions] = useState([]); // Store all questions
  const [loading, setLoading] = useState(false); // Loader state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const questionsPerPage = 5; // Number of questions per page

  // Fetch questions from API
  useEffect(() => {
    document.title = "Evangadi Forum";

    const token = localStorage.getItem("EVANGADI_FORUM_2024");

    setLoading(true);
    axiosInstance
      .get("/question", { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        setQuestions(res.data.questions); // Set questions from API response
        setLoading(false);
        // console.log(res.data);
      })
      .catch((err) => {
        setQuestions([]);
      });
  }, []);

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage; // Index of the last question
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage; // Index of the first question
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  ); // Get the current page's questions

  const totalPages = Math.ceil(questions.length / questionsPerPage); // Total pages calculation

  // Handlers for "Previous" and "Next" buttons
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Go to previous page
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Go to next page
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Questions</h1>
      <hr />

      {/* Display loader when loading */}
      {loading ? (
        <Loader />
      ) : questions?.length === 0 ? (
        <div className={styles.Not_Found}>
          <p>No Questions Found</p>
        </div>
      ) : (
        <>
          {/* Display questions for the current page */}
          {currentQuestions.map((question) => (
            <QuestionCard
              key={question.questionid}
              id={question.questionid}
              userName={question.username}
              questionTitle={question.title}
              description={question.description}
              question_date={question.createdAt}
            />
          ))}

          {/* Pagination controls */}
          <div className={styles.pagination}>
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1} // Disable if on first page
              style={{ marginRight: "10px", padding: "10px" }}
            >
              Previous
            </button>

            {/* Page information */}
            <span>
              Page {currentPage} of {totalPages}
            </span>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages} // Disable if on last page
              style={{ marginLeft: "10px", padding: "10px" }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Question;
