import styles from "./LogosCard.module.css";

// React hooks imports
import { useRef, useEffect } from "react";

// Utils imports
import calcCoordinates from "@/utils/calcCoordinates";
import hideElement from "@/utils/hideElement";
import showElement from "@/utils/showElement";

const LogosCard = ({ data, projectsToDisplay }) => {
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
      calcCoordinates(indexInProjectsToDisplay, logosCard.current);
      //   And we make sure the element is visible
      showElement(logosCard.current);
    } else hideElement(logosCard.current); // Otherwise we hide it
  }, [projectsToDisplay]);

  return (
    <div ref={logosCard} className={styles.logosCard} style={customStyles}>
      <img src={data.thumbnail.url} alt={data.thumbnail.alternativeText} />
    </div>
  );
};

export default LogosCard;
