// React hooks import
import { useState, useEffect, useRef } from "react";

// Custom hook to manage scroll behavior and sticky elements within a container
const useScrollSticky = (scrollX) => {
  const scrollProps = {
    offset: scrollX ? "offsetLeft" : "offsetTop",
    scroll: scrollX ? "scrollLeft" : "scrollTop",
    dimension: scrollX ? "width" : "height",
    transformAxis: scrollX ? "translateX" : "translateY",
    offsetSize: scrollX ? "offsetWidth" : "offsetHeight",
    clientSize: scrollX ? "clientWidth" : "clientHeight",
    scrollSize: scrollX ? "scrollWidth" : "scrollHeight",
    referencePos: scrollX ? "left" : "top",
  };
  const {
    offset,
    scroll,
    dimension,
    transformAxis,
    offsetSize,
    clientSize,
    scrollSize,
    referencePos,
  } = scrollProps;

  const [scrollPosition, setScrollPosition] = useState(0); // Tracks the current scroll position

  const containerRef = useRef(null); // Ref for the container element
  const ghostElemRef = useRef(null);
  const scrollDebounce = useRef(true); // Debounce flag to prevent rapid function calls
  const isProgrammaticScroll = useRef(false); // Skips scrollDebounce if the scroll is triggered programmatically
  const contentOverflows = useRef(false);
  const disable = useRef(false);

  const notifyHeightChange = (domElement) => {
    if (!containerRef.current) containerRef.current = domElement;
    const container = containerRef.current;

    const innerContainer = container.firstElementChild;

    const contentOverflows =
      innerContainer[scrollSize] - innerContainer[offsetSize] > 0;

    if (contentOverflows) {
      disable.current = false;
      const ghostElem = ghostElemRef.current || document.createElement("div");
      const ghostElemSize = scrollX
        ? innerContainer[scrollSize]
        : innerContainer[scrollSize] - innerContainer[offsetSize];

      ghostElem.style[dimension] = `${ghostElemSize}px`;
      ghostElem.style.visibility = "hidden";

      if (!ghostElemRef.current) {
        container.insertBefore(ghostElem, innerContainer.nextSibling);
        ghostElemRef.current = ghostElem;
      }

      // Clean up by removing the ghost element when the component unmounts
      return () => {
        if (container.contains(ghostElem)) {
          container.removeChild(ghostElem);
        }
      };
    } else {
      disable.current = true;
    }
  };

  // Create and insert a ghost element to maintain container height stability
  useEffect(() => {
    if (containerRef.current) {
      notifyHeightChange(containerRef.current);
    }
  }, [containerRef.current, notifyHeightChange]);

  // Function to handle snapping behavior based on scroll position
  const scrollSnap = (e) => {
    if (disable.current) return;

    if (isProgrammaticScroll.current || scrollDebounce.current) {
      scrollDebounce.current = false;

      if (!containerRef.current) containerRef.current = e.target;

      const container = containerRef.current;
      const innerContainer = container.firstElementChild;

      const childrenPositions = Array.from(
        container.firstElementChild.children
      ).map((child) => child[offset]);

      // Determine the scroll direction and the target section index
      const scrollDirection =
        container[scroll] > scrollPosition ? "down" : "up";

      // Reverse the order of the positions if scrolling up
      if (scrollDirection === "up") {
        childrenPositions.reverse();
      }

      // Find the index of the target section based on the scroll direction
      const targetSectionIndex = childrenPositions.findIndex((position) => {
        return scrollDirection === "up"
          ? container[scroll] >= position
          : container[scroll] <= position;
      });

      // Calculate and apply the new scroll position
      const newScrollPosition = childrenPositions[targetSectionIndex];
      innerContainer.style.transform = `${transformAxis}(-${newScrollPosition}px)`;
      setScrollPosition(newScrollPosition);

      // Reset programmatic scroll if needed
      if (isProgrammaticScroll.current) {
        isProgrammaticScroll.current = false;
      }

      // Reset debounce after a delay
      setTimeout(() => {
        scrollDebounce.current = true;
      }, 1250);
    } else {
      // Perform an instant scroll to the current scroll position

      containerRef.current.scrollTo({
        [referencePos]: scrollPosition,
        behavior: "instant",
      });
    }
  };

  // Function to sync the vertical translation of the container's children with scroll position
  const scrollBoundedChildSync = (e) => {
    if (disable.current) return;
    if (!containerRef.current) containerRef.current = e.target;

    const container = containerRef.current;
    const scrollValue = container[scroll];
    const movableElements = Array.from(container.firstElementChild.children);

    movableElements.forEach((element) => {
      const maxTranslateY = element[clientSize] - element[scrollSize];
      const transformMatrix = window.getComputedStyle(element).transform;
      const currentTranslateY =
        transformMatrix !== "none"
          ? parseFloat(transformMatrix.split(", ")[5].replace(")", ""))
          : 0;
      const newTranslateY = currentTranslateY + (scrollPosition - scrollValue);

      // Apply translation within bounds
      if (newTranslateY >= maxTranslateY && newTranslateY <= 0) {
        element.style.transform = `${transformAxis}(${newTranslateY}px)`;
      }
    });

    setScrollPosition(scrollValue);
  };

  // This function stacks child elements on top of each other during scrolling
  const scrollOverlapChildren = (e) => {
    if (disable.current) return;

    // If the scroll is programmatic or if debounce is active, handle the scroll
    if (isProgrammaticScroll.current || scrollDebounce.current) {
      // Disable debounce to prevent multiple triggers
      scrollDebounce.current = false;

      if (!containerRef.current) containerRef.current = e.target;

      const container = containerRef.current;

      // Retrieve all movable elements within the container
      const movableElements = Array.from(container.firstElementChild.children);

      // Determine the scroll direction
      const scrollDirection =
        container[scroll] > scrollPosition ? "down" : "up";

      // Reverse the order of elements if scrolling upwards
      if (scrollDirection === "up") {
        movableElements.reverse();
      }

      // Find the index of the target element to be displayed
      const targetChildIndex = movableElements.findIndex((element) => {
        return scrollDirection === "up"
          ? container[scroll] >= element[offset]
          : container[scroll] <= element[offset];
      });

      const newScrollPosition = movableElements[targetChildIndex][offset];

      // Adjust the position of each element based on the target scroll position
      movableElements.forEach((element) => {
        if (newScrollPosition >= element[offset]) {
          // If the current element is above or at the new scroll position, position it at the top
          element.style.transform = `${transformAxis}(-${element[offset]}px)`;
        } else {
          // Otherwise, align the elements below the new scroll position
          element.style.transform = `${transformAxis}(-${newScrollPosition}px)`;
        }
      });

      // Reset programmatic scroll flag if set
      if (isProgrammaticScroll.current) {
        isProgrammaticScroll.current = false;
      }

      // Update the state with the new scroll position
      setScrollPosition(newScrollPosition);

      // Reactivate debounce after a delay to allow for another scroll event
      setTimeout(() => {
        scrollDebounce.current = true;
      }, 1250);
    } else {
      // If debounce is not active, immediately scroll to the last known position
      containerRef.current.scrollTo({
        [referencePos]: scrollPosition,
        behavior: "instant",
      });
    }
  };

  // This function allows programmatic scrolling. When the scrollTo method is called, it triggers the applied scroll function.
  const jumpTo = (domElement, index) => {
    if (disable.current) return;
    // domElement: The container on which one of the hook's scroll functions is applied.
    // index: Number. The position of the child element to jump to.

    // Declare the programmatic scroll marker
    isProgrammaticScroll.current = true;

    // If no container is currently stored, use the one provided as an argument
    if (!containerRef.current) containerRef.current = domElement;

    const container = containerRef.current;

    // Get the position of the target child element
    const childPosition = container.firstElementChild.children[index][offset];

    // Perform the scroll to the target child position
    container.scrollTo({
      [referencePos]: childPosition,
      behavior: "instant",
    });
  };

  // const linkTo = (domElement, index, url) => {
  //   // Declare the programmatic scroll marker
  //   isProgrammaticScroll.current = true;

  //   // If no container is currently stored, use the one provided as an argument
  //   if (!containerRef.current) containerRef.current = domElement;

  //   const container = containerRef.current;
  //
  //   // Get the position of the target child element
  //   const childPosition = container.firstElementChild.children[index][offset];

  //   const handleNavigationComplete = () => {
  //     // Perform the scroll to the target child position after navigation
  //     container.scrollTo({
  //       top: childPosition,
  //       behavior: "instant",
  //     });

  //     // Clean up the event listener
  //     router.events.off("routeChangeComplete", handleNavigationComplete);
  //   };

  //   if (url) {
  //     // Set up an event listener to execute the scroll after navigation completes
  //     // router.events.on("routeChangeComplete", handleNavigationComplete);
  //     console.log(router.events);
  //     // Navigate to the target URL
  //     router.push(url);
  //   } else {
  //     // If no URL provided, just scroll to the target child position
  //     container.scrollTo({
  //       top: childPosition,
  //       behavior: "instant",
  //     });
  //   }

  //   // Perform the scroll to the target child position
  //   container.scrollTo({
  //     top: childPosition,
  //     behavior: "instant",
  //   });
  // };
  // const linkTo = (domElement, index, url) => {
  //   // Declare the programmatic scroll marker
  //   isProgrammaticScroll.current = true;

  //   // If no container is currently stored, use the one provided as an argument
  //   if (!containerRef.current) containerRef.current = domElement;

  //   const container = containerRef.current;
  //
  //   // Get the position of the target child element
  //   const childPosition = container.firstElementChild.children[index][offset];

  //   if (url) {
  //     router.push(url);
  //   }

  //   // Perform the scroll to the target child position
  //   container.scrollTo({
  //     top: childPosition,
  //     behavior: "instant",
  //   });
  // };

  return {
    scrollSnap,
    scrollBoundedChildSync,
    scrollOverlapChildren,
    jumpTo,
    notifyHeightChange,
    // linkTo,
    scrollPosition,
  };
};

export default useScrollSticky;
