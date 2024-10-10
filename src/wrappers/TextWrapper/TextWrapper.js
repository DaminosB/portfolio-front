"use client";

import styles from "./TextWrapper.module.css";

const TextWrapper = ({ children }) => {
  return (
    <div className={styles.textContainer}>
      <p>{children}</p>
    </div>
  );
};

export default TextWrapper;
