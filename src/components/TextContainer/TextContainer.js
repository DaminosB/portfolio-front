"use client";

import styles from "./TextContainer.module.css";

const TextContainer = ({ children }) => {
  return (
    <div className={styles.textContainer}>
      <p>{children}</p>
    </div>
  );
};

export default TextContainer;
