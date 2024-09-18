import styles from "./ZoomButton.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const ZoomButton = ({ customColors, onClickFunction }) => {
  const buttonInlineStyle = {
    color: customColors.secondaryColor,
    backgroundColor: customColors.mainColor,
  };
  return (
    <button
      className={styles.zoomButton}
      style={buttonInlineStyle}
      onClick={onClickFunction}
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </button>
  );
};

export default ZoomButton;
