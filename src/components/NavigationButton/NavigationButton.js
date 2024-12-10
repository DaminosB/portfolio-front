import styles from "./NavigationButton.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const NavigationButton = ({ isActive, onClickFunction, icon, inlineStyle }) => {
  return (
    <button
      className={isActive ? styles.active : styles.inactive}
      style={inlineStyle}
      onClick={onClickFunction}
    >
      <FontAwesomeIcon icon={icon} />
      {/* <FontAwesomeIcon icon={faCircle} /> */}
    </button>
  );
};

export default NavigationButton;
