import styles from "./DotButton.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const DotButton = ({ isActive, onClickFunction }) => {
  return (
    <button
      className={isActive ? styles.active : styles.inactive}
      onClick={onClickFunction}
    >
      <FontAwesomeIcon icon={faCircle} />
    </button>
  );
};

export default DotButton;
