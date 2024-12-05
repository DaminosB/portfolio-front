import { useRef, useState } from "react";

// Custom hook to track the user's scroll movements and return the scroll position of an element and the currently visible child element's index
const useScrollTracker = (scrollX = false) => {
  // Determines whether to track scrolling on the X axis (horizontal) or Y axis (vertical)
  // Default axis is Y unless scrollX is set to true

  // Maps scroll-related properties based on the chosen axis (X or Y)
  const scrollProps = {
    scrollAxis: scrollX ? "scrollLeft" : "scrollTop", // Scroll position of the scroller
    offsetDimension: scrollX ? "offsetWidth" : "offsetHeight", // Dimensions of the scroller
  };
  const { offsetDimension, scrollAxis } = scrollProps;

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

    // Update the scroll position state (scrollTop or scrollLeft depending on the axis)
    setScrollPosition(scroller[scrollAxis]);

    let container = scroller;

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
    // Filter out STYLE elements and calculate the cumulative position of each child
    const cumulativeDimensions = Array.from(container.children)
      .filter((child) => child.tagName !== "STYLE") // Exclude STYLE tags from the calculation
      .map((child, index) => scroller[offsetDimension] * index); // Calculate the position based on the index

    // Find the index of the last child whose offset value matches the current scroll position
    const newIndex = cumulativeDimensions.findIndex(
      (position) => position === Math.round(scroller[scrollAxis])
    );

    // If a valid index is found and differs from the current active index, update the active child index
    if (newIndex !== -1 && newIndex !== displayIndex) setDisplayIndex(newIndex);
  };

  // Return the scroll tracking function, current active child index, and scroll position
  return { scrollTrack, displayIndex, scrollPosition };
};

export default useScrollTracker;
