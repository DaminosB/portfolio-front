import { useState, useRef } from "react";

const useGrabAndMove = (containerId, relatedSiblings) => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentTranslateValue, setCurrentTranslateValue] = useState(0);
  const previousClickPosition = useRef(0);
  const previousDeltaX = useRef(0);
  const elementsToMove = useRef([]);

  const startGrab = (e) => {
    if (elementsToMove.current.length === 0) {
      if (relatedSiblings) {
        relatedSiblings.forEach((sibling) =>
          elementsToMove.current.push(
            document.getElementById(sibling).children[0]
          )
        );
      } else {
        elementsToMove.current.push(
          document.getElementById(containerId).children[0]
        );
      }
    }

    setIsDragging(true);

    switch (e.type) {
      case "touchstart":
        previousClickPosition.current = e.targetTouches[0].clientX;
        break;
      case "mousedown":
        previousClickPosition.current = e.clientX;
        break;
      default:
        break;
    }
  };

  const grabbing = (e) => {
    // If the isDragging state is false, nothing happens
    if (isDragging) {
      // We must set the click's position, but it's stored in different places on mouse and touch events
      let currentClickPosition;
      if (e.type === "touchmove") {
        currentClickPosition = e.targetTouches[0].clientX;
      } else if (e.type === "mousemove") {
        currentClickPosition = e.clientX;
      }

      // We check the difference between our current position and the one previously stored
      const deltaX = currentClickPosition - previousClickPosition.current;
      // It gives us the number of pixels the viwer has slided

      // The dragged element is different on big and small screens

      //   Then we call the function that will move the element in its parent
      // moveElementInParent(deltaX, e.target);
      moveElementInParent(deltaX, elementsToMove.current);

      // Finaly we give these refs their new value
      previousClickPosition.current = currentClickPosition;
      previousDeltaX.current = deltaX;
    }
  };

  // This func is called when the wrapper is unclicked
  const stopGrab = (e) => {
    // If the dragging state was on false, nothing happens
    if (isDragging) {
      // We begin by turning the dragging state off
      setIsDragging(false);

      // We want to dragging effect to end smoothly, so we create a recursive function that will call the moving function multiple times.
      let animatedScrollDistance = previousDeltaX.current;

      let animationFrame;

      // This func will be called mutiple times to smooth the ending of the sliding effect
      const step = () => {
        // moveElementInParent(animatedScrollDistance, e.target);
        moveElementInParent(animatedScrollDistance, elementsToMove.current);
        // The distance to scroll loses 10% on each call
        animatedScrollDistance /= 1.15;
        if (Math.abs(animatedScrollDistance) > 0.1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          previousDeltaX.current = 0;
        }
      };
      animationFrame = requestAnimationFrame(step);
    }
  };

  // This func moves a given element in its parent on its x axis
  const moveElementInParent = (value, array) => {
    // value: Number. The quantity of pixels the viewer has slided.
    // domElement : the element we want to move.
    // relatedSiblings: Array. With the multi-images-column module, we must move each related sibling together.

    // This stores the current amount of pixels is currently translated on the domElement
    const currentTranslateValue =
      parseFloat(array[0].style.transform.split("(")[1]) || 0;
    // It checks the transform css property value. If undefined, the value is 0.

    // The new amount of translated pixels equals the previous value + the quantity of pixels the viewer has slided.
    let newTranslateXValue = currentTranslateValue + value;

    // The parent's width will give us the min and max translation values
    const parentWidth = array[0].parentNode.offsetWidth;

    const widthDifference = array[0].offsetWidth - parentWidth;
    const translateXValueMax = widthDifference / 2;
    const translateXValueMin = -translateXValueMax;

    // If the newTranslateValue is over or under its min and max values, we give it these values.
    if (newTranslateXValue > translateXValueMax) {
      newTranslateXValue = translateXValueMax;
    } else if (newTranslateXValue < translateXValueMin) {
      newTranslateXValue = translateXValueMin;
    }

    // If the related siblings array has any data, we move all of them simultaneously
    // if (relatedSiblings !== undefined) {
    array.map((sibling) => {
      sibling.style.transform = `translateX(${newTranslateXValue}px)`;
    });

    setCurrentTranslateValue(newTranslateXValue);
  };

  return {
    startGrab,
    grabbing,
    stopGrab,
    currentTranslateValue,
  };
};

export default useGrabAndMove;
