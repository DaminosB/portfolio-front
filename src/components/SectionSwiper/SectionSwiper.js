import styles from "./SectionSwiper.module.css";

// Icons imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

// This component lets the visitor change active index with a click
const SectionSwiper = ({ setActiveIndex, style }) => {
  // setActiveIndex: Func. Updates the active index's state
  // style: Object. The style informations got through a request to the back

  // We set the custom styles object
  const customStyles = {
    backgroundColor: style.defaultBackgroundColor,
    color: style.defaultFontColor,
    borderColor: style.defaultFontColor,
  };

  return (
    <div className={styles.sectionSwiper}>
      <span style={customStyles}>Créations</span>
      <button
        className={styles.swiperButton}
        onClick={() => setActiveIndex(1)}
        style={customStyles}
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
    </div>
  );
};

export default SectionSwiper;
