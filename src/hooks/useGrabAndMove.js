import runRecursiveAction from "@/utils/runRecursiveAction";
import { useState, useRef, useEffect, useCallback } from "react";

// This hook enables the user to click and drag an element to move it within its parent container.
const useGrabAndMove = () => {
  // State to track whether the user is currently clicking and dragging the element.
  // True when mouse down, false when mouse up, preventing further actions when false.
  const [isGrabbing, setIsGrabbing] = useState(false);

  // State to indicate whether any action (e.g., drag, resize) is currently in progress.
  // This can be used to prevent or trigger certain behaviors when an action is ongoing.
  const [isWorking, setIsWorking] = useState(false);

  // State to track whether a resize operation is happening.
  // True when resizing, false when finished, can be used to prevent or trigger certain behaviors.
  const [isResizing, setIsResizing] = useState(false);

  // State to hold the current metrics of the component
  const [metrics, setMetrics] = useState({
    currentTranslateValue: 0, // Current translation value of the child element (x-axis).
    containerWidth: 0, // Width of the container in which the child element moves.
    childWidth: 0, // Width of the child element being dragged.
  });

  // Ref to store the container's DOM element for future access.
  const containerRef = useRef(null);

  // Refs to store the previous click position and the delta of movement (x-axis).
  // Used to calculate and apply movement during drag operations.
  const previousClickPosition = useRef(0);
  const previousDeltaX = useRef(0);

  // Debounce ref (used in the useEffect)
  const debounce = useRef(true);

  // This function is called on mouse down or touch start events to initiate the grabbing action
  const startGrab = useCallback(
    (e) => {
      // Checks if the child element overflows its parent. If not, the function stops.
      const contentOverflows = metrics.containerWidth < metrics.childWidth;
      if (!contentOverflows) return;

      // Checks and assigns the containerRef if it's not already set
      if (!containerRef.current) containerRef.current = e.currentTarget;

      // Updates the state to indicate that grabbing has started
      setIsGrabbing(true);

      previousClickPosition.current = e.clientX;
    },
    [metrics]
  );

  // This func moves a given element in its parent on its x axis
  const moveElementInParent = useCallback((value, domElement) => {
    // value: Number. The quantity of pixels the viewer has slided.
    // domElement: the element we want to move.
    // peerElementsIds: Array. With the multi-images-column module, we must move each related sibling together.

    // This stores the current amount of pixels is currently translated on the domElement
    const currentTranslateValue =
      parseFloat(domElement.style.transform.split("(")[1]) || 0;
    // It checks the transform css property value. If undefined, the value is 0.

    // The new amount of translated pixels equals the previous value + the quantity of pixels the viewer has slided.
    const newTranslateXValue = currentTranslateValue + value;

    // The parent's width will give us the min and max translation values
    const parentWidth = domElement.parentNode.offsetWidth;

    const widthDifference = domElement.offsetWidth - parentWidth;
    const translateXValueMax = widthDifference / 2;
    const translateXValueMin = -translateXValueMax;

    if (
      newTranslateXValue <= translateXValueMax &&
      newTranslateXValue >= translateXValueMin
    ) {
      domElement.style.transform = `translateX(${newTranslateXValue}px)`;

      setMetrics((prev) => ({
        ...prev,
        currentTranslateValue: newTranslateXValue,
      }));

      // e.stopPropagation();
    }
  }, []);

  // This function is called on mouse move and touch move events
  const grabbing = useCallback(
    (e) => {
      // If the isGrabbing state is false, no action is taken
      if (!isGrabbing) return;

      // Set the working state to true during the action
      setIsWorking(true);

      const container = containerRef.current;

      const currentClickPosition = e.clientX;

      // Calculate the difference between the current and the previous positions
      const deltaX = currentClickPosition - previousClickPosition.current;
      // This gives us the number of pixels the viewer has moved

      // Call the function responsible for moving the element within its parent
      moveElementInParent(deltaX, container.firstElementChild);

      // Finally, update the refs with the new position and delta values
      previousClickPosition.current = currentClickPosition;
      previousDeltaX.current = deltaX;
    },
    [isGrabbing, moveElementInParent]
  );

  // This function is called on mouse up or touch end events
  const stopGrab = useCallback(
    (e) => {
      // If the isGrabbing state is false, nothing happens
      if (!isGrabbing) return;

      const container = containerRef.current;

      // Turn off the isGrabbing state when the user stops dragging
      setIsGrabbing(false);

      const handleMoveElementInParent = (animatedScrollDistance) => {
        moveElementInParent(
          animatedScrollDistance,
          container.firstElementChild
        );
      };

      runRecursiveAction(
        handleMoveElementInParent,
        previousDeltaX.current,
        0.85
      );

      // Once the animation is finished, reset the deltaX value
      previousDeltaX.current = 0;

      // Indicate that the work is done
      requestAnimationFrame(() => {
        setIsWorking(false);
      });
    },
    [isGrabbing, moveElementInParent]
  );

  // The metrics values are only given when the containerRef is filled.
  // Normaly this happens at the first click on the element, but we may want to connect the hook programmaticaly.
  const initGrabAndMove = useCallback((domElement) => {
    if (!containerRef.current) containerRef.current = domElement;
  }, []);

  // The useEffect declares a resize observer on the ement and its child
  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const resizeObserver = new ResizeObserver(() => {
        // Indicates that the elements are resizing
        setIsResizing(true);

        // Metrics are updated
        setMetrics((prev) => ({
          ...prev,
          containerWidth: container.offsetWidth,
          childWidth: child.scrollWidth,
        }));

        // After a delay, indicates that the resizing is done
        if (debounce.current) {
          debounce.current = false;
          setTimeout(() => {
            setIsResizing(false);
            debounce.current = true;
          }, 500);
        }
      });
      const child = container.firstElementChild;

      resizeObserver.observe(child);
      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [containerRef.current]);

  return {
    startGrab,
    grabbing,
    stopGrab,
    initGrabAndMove,
    isWorking,
    isResizing,
    metrics,
  };
};

export default useGrabAndMove;
