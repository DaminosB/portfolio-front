"use client";

import styles from "./TextContainer.module.css";

const TextContainer = ({ sectionId, children }) => {
  const textWrapperId = `${sectionId}-text-wrapper`;

  return (
    <div id={textWrapperId} className={styles.textContainer}>
      <p>{children}</p>
    </div>
  );
};

export default TextContainer;
