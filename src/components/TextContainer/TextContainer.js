import styles from "./TextContainer.module.css";

const TextContainer = ({ text }) => {
  return (
    <div className={styles.textContainer}>
      <p>{text}</p>
    </div>
  );
};

export default TextContainer;
