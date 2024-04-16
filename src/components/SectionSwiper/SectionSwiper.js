import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./SectionSwiper.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SectionSwiper = ({ direction, setActiveIndex, style, text }) => {
  const icon = direction === "up" ? faChevronUp : faChevronDown;
  const position = direction === "up" ? styles.topPos : styles.bottomPos;

  //   const containerCustomStyles = {
  //     color: style.defaultFontColor,
  //   };

  //   const buttonCustomStyles = {
  //     backgroundColor: style.defaultBackgroundColor,
  //     color: style.defaultFontColor,
  // };

  const customStyles = {
    backgroundColor: style.defaultBackgroundColor,
    color: style.defaultFontColor,
    borderColor: style.defaultFontColor,
  };

  return (
    <div
      className={`${styles.sectionSwiper} ${position}`}
      //   style={customStyles}
      //   style={containerCustomStyles}
    >
      {direction === "down" && <span style={customStyles}>{text}</span>}
      <button
        className={styles.swiperButton}
        onClick={setActiveIndex}
        // style={buttonCustomStyles}
        style={customStyles}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
      {direction === "up" && <span style={customStyles}>{text}</span>}
    </div>
  );
};

export default SectionSwiper;
