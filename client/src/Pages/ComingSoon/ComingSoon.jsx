// ComingSoon.js
import React from "react";
import styles from "./ComingSoon.module.css";

const ComingSoon = () => {
  return (
    <div className={styles.comingSoon__container}>
      <div className={styles.inner_container}>
        <h1 className={styles.comingSoon__title}>Coming Soon</h1>
        <div className={styles.animation}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <p className={styles.comingSoon__text}>
        We are working hard to bring you a great experience. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;
