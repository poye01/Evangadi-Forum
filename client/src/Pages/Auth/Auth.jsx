import { useState } from "react";
import styles from "./auth.module.css";
import Login from "../../components/Login/Login.jsx";
import SignUp from "../../components/SignUp/SignUp.jsx";
import About from "../../components/About/About.jsx";
import { useLocation } from "react-router-dom";

export default function Auth() {
  const navStateData = useLocation();
  const [isLogin, setisLogin] = useState(true); // Renamed the setter to match the state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Function to toggle between SignUp and Login forms
  const toggleForm = () => {
    setIsTransitioning(true); // Start the transition
    setTimeout(() => {
      setisLogin((prev) => !prev); // Change the component after fade-out
      setIsTransitioning(false); // End the transition after fade-in
    }, 500); // 500ms - CSS transition duration
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.inner_container}>
          <div
            className={`${styles.formContainer} ${
              isTransitioning ? styles.fadeOut : styles.fadeIn
            }`}
          >
            {isLogin ? (
              <Login onSwitch={toggleForm} useLocData={navStateData} />
            ) : (
              <SignUp onSwitch={toggleForm} />
            )}
          </div>
          <div className={styles.about}>
            <About />
          </div>
        </div>
      </div>
    </>
  );
}
