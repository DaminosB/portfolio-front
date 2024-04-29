"use client";

import styles from "./Module_Text.module.css";

const Module_Text = ({ stylingObject, text }) => {
  return (
    <div style={stylingObject} className={styles.textContainer}>
      <p>{text}</p>
    </div>
  );
};

export default Module_Text;
