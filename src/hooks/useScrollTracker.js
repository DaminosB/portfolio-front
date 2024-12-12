import { useRef, useState } from "react";

// Custom hook to track the user's scroll movements and return the scroll position of an element and the currently visible child element's index
const useScrollTracker = (scrollX = false) => {
  // Determines whether to track scrolling on the X axis (horizontal) or Y axis (vertical)
  // Default axis is Y unless scrollX is set to true

  // Maps scroll-related properties based on the chosen axis (X or Y)
  const scrollProps = {
    offsetDimension: scrollX ? "offsetWidth" : "offsetHeight",
    offsetPosition: scrollX ? "offsetLeft" : "offsetTop",
    scrollAxis: scrollX ? "scrollLeft" : "scrollTop",
  };
  const { offsetDimension, offsetPosition, scrollAxis } = scrollProps;

  // State to store the current scroll position (scrollTop or scrollLeft)
  const [scrollPosition, setScrollPosition] = useState(0);

  // State to store the index of the currently active child element based on scroll position
  const [displayIndex, setDisplayIndex] = useState(0);

  // Ref to store the scroller element being tracked
  const scrollerRef = useRef(null);

  // Function to be attached to the scroller's `onScroll` event to track scroll movements
  const scrollTrack = (e, childrenCoords = []) => {
    // If the scroller reference is not set yet, assign it to the target element of the scroll event
    if (!scrollerRef.current) scrollerRef.current = e.target;
    const scroller = scrollerRef.current;

    let container = scroller;

    const newScrollPosition = scroller[scrollAxis];

    // Traverse through the provided children coordinates to find the nested child element
    // The coordinates array defines a path to follow through nested child elements
    childrenCoords.forEach((coord) => {
      if (container.children[coord]) {
        container = container.children[coord]; // Move to the child element at the current index
      } else {
        // If the specified index doesn't exist, throw an error indicating the problem
        throw new Error(
          `childrenCoords Error: Element not found at index ${coord}`
        );
      }
    });

    // Get the offsetTop or offsetLeft of each child element within the current container
    const childrenPositions = Array.from(container.children).map(
      (child) => child[offsetPosition]
    );

    const scrollDirection = newScrollPosition > scrollPosition ? "down" : "up";

    const viewEnd = newScrollPosition + scroller[offsetDimension];

    // Find the index of the child whose offset position matches the current scroll position
    const newIndex = childrenPositions.findIndex((position, i, array) => {
      if (scrollDirection === "down") {
        return viewEnd >= position && newScrollPosition <= position;
      } else {
        const nextPosition = array[i + 1];
        return (
          newScrollPosition >= position && newScrollPosition < nextPosition
        );
      }
    });

    // Update the displayed index
    if (newIndex !== -1 && newIndex !== displayIndex) setDisplayIndex(newIndex);

    // Update the scroll position state (scrollTop or scrollLeft depending on the axis)
    setScrollPosition(newScrollPosition);
  };

  // Return the scroll tracking function, current active child index, and scroll position
  return { scrollTrack, displayIndex, scrollPosition };
};

export default useScrollTracker;
