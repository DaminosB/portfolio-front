import styles from "./LogosCard.module.css";

// React hooks imports
import { useRef, useEffect } from "react";

import Link from "next/link";

// Utils imports
import calcCoordinates from "@/utils/calcCoordinates";

const LogosCard = ({
  data,
  projectsToDisplay,
  styleInputs,
  handleOnMouseEnter,
  handleMonMouseLeave,
  indexInParent,
}) => {
  const logosCard = useRef(null);

  const customStyles = { backgroundColor: data.thumbnailColor };

  useEffect(() => {
    // To determine our actions, we need to know the index of the card on the projectsToDisplay array
    const indexInProjectsToDisplay = projectsToDisplay.findIndex(
      (projectToDisplay) => projectToDisplay === "logos"
    );

    // We check if the card is to be displayed
    if (indexInProjectsToDisplay !== -1) {
      // We calculte its coordinates
      calcCoordinates(indexInProjectsToDisplay, logosCard.current, styleInputs);
      //   And we make sure the element is visible
      logosCard.current.classList.remove("hidden");
    } else logosCard.current.classList.add("hidden"); // Otherwise we hide it
  }, [projectsToDisplay]);

  return (
    <div
      ref={logosCard}
      className={styles.logosCard}
      style={customStyles}
      onMouseEnter={() => handleOnMouseEnter(indexInParent)}
      onMouseLeave={handleMonMouseLeave}
    >
      <Link href={"/logos"}>
        <img src={data.thumbnail.url} alt={data.thumbnail.alternativeText} />
      </Link>
    </div>
  );
};

export default LogosCard;
