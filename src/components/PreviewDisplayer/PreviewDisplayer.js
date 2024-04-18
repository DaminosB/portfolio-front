import styles from "./PreviewDisplayer.module.css";

// React hooks import
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

// This comp displays the cover of the project whose card is being hovered in the ProjectsContainer
const PreviewDisplayer = ({ image }) => {
  // This comp uses a portal, so we need to mount it only when the DOM is ready
  const [domReady, setDomReady] = useState(false);

  //   This state stores the URL of the image we want to display
  const [imageToDisplay, setImageToDisplay] = useState("");

  const previewDisplayerRef = useRef(null);

  //   This useEffect is called anytime the prop image is changed.
  useEffect(() => {
    //   If we are executing this, it means the DOM is ready so we can mount it
    setDomReady(true);

    // A shortcut for the DOM ref
    const element = previewDisplayerRef.current;

    if (element && image) {
      // If an image is defined in the props, we set the corresponding state with its value and giv the ref an opacity of 1
      requestAnimationFrame(() => (element.style.opacity = 1));

      //   Storing the image URL in a state allows us to create a fade away effect when the project's card is not hovered anymore
      setImageToDisplay(image);
    } else if (element) {
      requestAnimationFrame(() => (element.style.opacity = 0));
    }
  }, [image]);

  return (
    domReady &&
    createPortal(
      <div className={styles.previewDisplayer} ref={previewDisplayerRef}>
        <img src={imageToDisplay} />
      </div>,
      document.getElementById("content-wrapper")
    )
  );
};

export default PreviewDisplayer;
