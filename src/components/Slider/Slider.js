import styles from "./Slider.module.css";

const Slider = ({ children }) => {
  return (
    <div id="slider" className={styles.slider}>
      {children}
    </div>
  );
};

export default Slider;
