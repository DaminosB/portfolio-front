"use client";

import styles from "./MediasWrapper.module.css";

// React hooks imports
import { useEffect, useState, useRef } from "react";

// Components imports
import MediasNavigation from "../MediasNavigation/MediasNavigation";

// This component wraps the medias of each displayed module. It is rendered client side to let the user interact with the content
const MediasWrapper = ({ children, module, id }) => {
  // We check if the content is viewed on a big screen. Otherwise elements will be displayed differently
  const [isBigScreen, setIsBigScreen] = useState(true);
  // On big screens, the wrapper is the same width than the section, so images are slidable in their parent to be viewed whole.
  // On small screens, the wrapper is the width of its content. So now we must slide the wrapper in its parent.

  // This state is changed when the viewer clicks the content
  // On false, none of the dragging effects are active
  const [isDragging, setIsDragging] = useState(false);

  // The wrapper's dom element
  const mediasWrapperRef = useRef(null);

  // We store the previous click and movement informations to compare them to the current ones later
  const previousClickPosition = useRef(0);
  const previousDeltaX = useRef(0);

  // These constants call functions that return css classes. They will be applied to the wrapper's dom element.
  const moduleClass = defineMediasWrapperMode(module.__component);
  const grabbingClass = defineGrabbingClass(isBigScreen, isDragging);

  // This will be used by the multi-images-column module in order to move every sibling at the same time.
  const relatedSiblings = useRef([]);

  // This useEffect is only called at the component's mounting
  useEffect(() => {
    // Some styling parameters from the server request are different according to the screen size. We apply them in the useEffect in order to check the screen size.
    const clientWidth = window.innerWidth;

    moduleStyling(module, mediasWrapperRef.current);

    // Let's set the big screen state
    if (clientWidth >= 1024) {
      setIsBigScreen(true);

      // On big screens, images are wider than their parents and are grabbable.
      // So we set their grabbing class
      toggleGrabbingClass(mediasWrapperRef.current, "ungrab");
    } else {
      setIsBigScreen(false);
    }

    // If the wrapper displays the multi-images-column module, we must populate the relatedSiblings array.
    if (module.__component === "module.colonne-multi-images") {
      module.medias.forEach((media) => {
        if (clientWidth >= 1024) {
          // On big screens, we slide the wrapper in its parent
          const element = document.getElementById(`media-content-${media.id}`);
          relatedSiblings.current.push(element);
        } else {
          // Otherwise we slide the image in its container
          const element = document.getElementById(`medias-wrapper-${media.id}`);
          relatedSiblings.current.push(element);
        }
      });
    }
  }, []);

  // This func is called when the wrapper or its content is clicked
  const grabCursor = (e) => {
    // It checks if the clicked element is wider than its parent.
    // If so it will allow the grabbing and moving functions to work.

    // First we must identify what is the element we may want to slide.
    let activeElement;

    if (isBigScreen) {
      // On big screens, the image slides in its parent, so the clicked element is the image
      activeElement = e.target;

      // We change all the images grabbing classes accordingly
      toggleGrabbingClass(mediasWrapperRef.current, "grab");
    } else {
      // On small screens, the wrapper is the element we slide
      activeElement = mediasWrapperRef.current;
    }

    // To check if the active element overflows its parent, we must store the parent's width
    const parentWidth = activeElement.parentNode.offsetWidth;

    const elemOverflowsParent = activeElement.offsetWidth > parentWidth;

    // If there is an overflow, we want the element to be able to slide
    if (elemOverflowsParent) {
      // We set the dragging state on true to allow the dragging effects to be active
      setIsDragging(true);
      // If no overflow, dragging effects are inactive

      // The clicked position is stored in different places on mouse and touch events.
      // We store it to be compared later
      switch (e._reactName) {
        case "onTouchStart":
          previousClickPosition.current = e.targetTouches[0].clientX;
          break;

        case "onMouseDown":
          previousClickPosition.current = e.clientX;
          break;

        default:
          break;
      }
    }
  };

  // This func is called when the mouse or the finger is moved over the wrapper
  const moveCursor = (e) => {
    // If the isDragging state is false, nothing happens
    if (isDragging) {
      // We must set the click's position, but it's stored in different places on mouse and touch events
      let currentClickPosition;
      if (e._reactName === "onTouchMove") {
        currentClickPosition = e.targetTouches[0].clientX;
      } else if (e._reactName === "onMouseMove") {
        currentClickPosition = e.clientX;
      }

      // We check the difference between our current position and the one previously stored
      const deltaX = currentClickPosition - previousClickPosition.current;
      // It gives us the number of pixels the viwer has slided

      // The dragged element is different on big and small screens
      let elementToMove;

      if (isBigScreen) elementToMove = e.target.tagName === "IMG" && e.target;
      else elementToMove = mediasWrapperRef.current;

      // Then we call the function that will move the element in its parent
      if (elementToMove)
        moveElementInParent(deltaX, elementToMove, relatedSiblings.current);

      // Finaly we give these refs their new value
      previousClickPosition.current = currentClickPosition;
      previousDeltaX.current = deltaX;
    }
  };

  // This func is called when the wrapper is unclicked
  const ungrabCursor = (e) => {
    // If the dragging state was on false, nothing happens
    if (isDragging) {
      // We begin by turning the dragging state off
      setIsDragging(false);

      // We want to dragging effect to end smoothly, so we create a recursive function that will call the moving function multiple times.
      let animatedScrollDistance = previousDeltaX.current;

      // The element to move is different on big and small screens
      let elementToMove;

      if (isBigScreen) {
        elementToMove = elementToMove = e.target.tagName === "IMG" && e.target;

        // The new grabbing classes must be set on all the wrapper's images
        toggleGrabbingClass(mediasWrapperRef.current, "ungrab");
      } else {
        elementToMove = mediasWrapperRef.current;
      }

      if (elementToMove) {
        // This func will be called mutiple times to smooth the ending of the sliding effect
        const step = () => {
          moveElementInParent(
            animatedScrollDistance,
            elementToMove,
            relatedSiblings.current
          );
          // The distance to scroll loses 10% on each call
          animatedScrollDistance /= 1.1;
          if (Math.abs(animatedScrollDistance) > 0.1) {
            animationFrame = requestAnimationFrame(step);
          } else {
            previousDeltaX.current = 0;
          }
        };
        let animationFrame = requestAnimationFrame(step);
      }
    }
  };

  return (
    <div
      className={`${styles.mediasWrapper} ${moduleClass} ${grabbingClass}`}
      id={`medias-wrapper-${id}`}
      ref={mediasWrapperRef}
      onMouseDown={grabCursor}
      onMouseUp={ungrabCursor}
      onTouchStart={grabCursor}
      onTouchEnd={ungrabCursor}
      onMouseMove={moveCursor}
      onTouchMove={moveCursor}
    >
      {/* <MediasNavigation /> */}
      {children}
    </div>
  );
};

// This func returns the grabbing css classes of the wrapper
const defineGrabbingClass = (isBigScreen, isDragging) => {
  if (!isBigScreen) return isDragging ? "grabbed" : "grabbable";
  else return "";
};

// This func returns the wrapper's class according to the type of module it's displaying
const defineMediasWrapperMode = (component) => {
  if (component === "module.container") {
    return styles.containerMode;
  } else if (component === "module.pleine-page") {
    return styles.fullpageMode;
  } else if (component === "module.colonne-multi-images") {
    return styles.multiImagesMode;
  }
};

// This func toggles the grabbing css classes of the images
const toggleGrabbingClass = (mediasWrapper, action) => {
  // We want to change the class of every sibling image all at once
  const imgArray = Array.from(mediasWrapper.querySelectorAll("img"));

  imgArray.forEach((img) => {
    const parentWidth = img.parentNode.offsetWidth;
    if (img.offsetWidth > parentWidth) {
      // If the image is not wider than ots parent, it is not draggable
      switch (action) {
        case "grab":
          img.classList.remove("grabbable");
          img.classList.add("grabbed");

          break;

        case "ungrab":
          img.classList.remove("grabbed");
          img.classList.add("grabbable");

          break;

        default:
          break;
      }
    }
  });
};

// This func moves a given element in its parent on its x axis
const moveElementInParent = (deltaX, elementToMove, relatedSiblings) => {
  // deltaX: Number. The quantity of pixels the viewer has slided.
  // domElement : the element we want to move.
  // relatedSiblings: Array. With the multi-images-column module, we must move each related sibling together.

  // This stores the current amount of pixels is currently translated on the domElement
  const translateXValue =
    parseFloat(elementToMove.style.transform.split("(")[1]) || 0;
  // It checks the transform css property value. If undefined, the value is 0.

  // The new amount of translated pixels equals the previous value + the quantity of pixels the viewer has slided.
  let newTranslateXValue = translateXValue + deltaX;

  // The parent's width will give us the min and max translation values
  const parentWidth = elementToMove.parentNode.offsetWidth;

  const widthDifference = elementToMove.offsetWidth - parentWidth;
  const translateXValueMax = widthDifference / 2;
  const translateXValueMin = -translateXValueMax;

  // If the newTranslateValue is over or under its min and max values, we give it these values.
  if (newTranslateXValue > translateXValueMax) {
    newTranslateXValue = translateXValueMax;
  } else if (newTranslateXValue < translateXValueMin) {
    newTranslateXValue = translateXValueMin;
  }

  // If the related siblings array has any data, we move all of them simultaneously
  if (relatedSiblings.length > 0) {
    relatedSiblings.map((sibling) => {
      sibling.style.transform = `translateX(${newTranslateXValue}px)`;
    });
  } else {
    // Otherwise we just move the dragged element
    elementToMove.style.transform = `translateX(${newTranslateXValue}px)`;
  }
};

// This func gives its customized styles to the wrapper
const moduleStyling = (module, mediasWrapper) => {
  const {
    gap,
    backgroundImage,
    backgroundColor,
    medias,
    imageSliderColor,
    imagesPerRow,
    text,
  } = module;

  const isBigScreen = window.innerWidth >= 1024;

  if (medias.length > 1) {
    // If multiple medias must be displayed, we apply the gap value the user has stored
    mediasWrapper.style.gap = `${gap}px`;
  }

  if (isBigScreen && module.__component === "module.container") {
    // The mediaCards are the children of the wrapper. They are the direct parent of each image
    const mediaCardsArray = Array.from(mediasWrapper.children);

    // The container module lets the user display a series of thumbnails that can be on multiple lines.
    // So each media card must a corresponding width.
    mediaCardsArray.map((mediaCard, index) => {
      const imagesPerLine = imagesPerRow;
      mediaCard.style.width = `calc((100% - ${
        (imagesPerLine - 1) * gap
      }px) / ${imagesPerLine})`;
    });
  }
};

export default MediasWrapper;
