// import { useRef, useState } from "react";

// // Tracks the user's scroll movements and returns the element's scroll position and the child it's currently on
// const useScrollTracker = (scrollX) => {
//   // By default, the scrutated axis is Y but if asked the hook can stracks the scrolls on the x axis

//   // The corresponding keys by the asked axis
//   const scrollProps = {
//     offsetAxis: scrollX ? "offsetLeft" : "offsetTop",
//     scroll: scrollX ? "scrollLeft" : "scrollTop",
//   };
//   const { offsetAxis, scroll } = scrollProps;

//   // The scrollTop or scrollLeft value of the component
//   const [scrollPosition, setScrollPosition] = useState(0);

//   // The index of the child the scroll is on
//   const [activeChildIndex, setActiveChildIndex] = useState(0);

//   // Stores the element the hook is filled in
//   const containerRef = useRef(null);

//   // Stores the last active index
//   const cachedActiveIndex = useRef(activeChildIndex);

//   // Connected to the scrollabale elements, it sets the scrollPosition and activeChildIndex states
//   const scrollTrack = (e) => {
//     // If not filled yet, stores the element in its ref
//     if (!containerRef.current) containerRef.current = e.target;
//     const container = containerRef.current;

//     // Updates the scrollPosition state
//     setScrollPosition(container[scroll]);

//     // Every child's offsetTop or offsetLeft value
//     const childrenPositions = Array.from(container.children).map(
//       (child) => child[offsetAxis]
//     );

//     // Finds which child has its top border at the top of the element
//     const newIndex = childrenPositions.findLastIndex(
//       // Uses the last index because sticky elements have the same offsetAxis value when they are scrolled
//       (position) => position === container[scroll]
//     );

//     // If an index has been found and it's different from the cached one, updates the corresponding child
//     if (newIndex !== -1 && newIndex !== cachedActiveIndex.current) {
//       setActiveChildIndex(newIndex);
//       cachedActiveIndex.current = newIndex;
//     }
//   };

//   return { scrollTrack, activeChildIndex, scrollPosition };
// };

// export default useScrollTracker;

import { useRef, useState } from "react";

// Custom hook to track the user's scroll movements and return the scroll position of an element and the currently visible child element's index
const useScrollTracker = (scrollX = false) => {
  // Determines whether to track scrolling on the X axis (horizontal) or Y axis (vertical)
  // Default axis is Y unless scrollX is set to true

  // Maps scroll-related properties based on the chosen axis (X or Y)
  const scrollProps = {
    offsetAxis: scrollX ? "offsetLeft" : "offsetTop", // Position of each child relative to the container
    scrollAxis: scrollX ? "scrollLeft" : "scrollTop", // Scroll position of the container
  };
  const { offsetAxis, scrollAxis } = scrollProps;

  // State to store the current scroll position (scrollTop or scrollLeft)
  const [scrollPosition, setScrollPosition] = useState(0);

  // State to store the index of the currently active child element based on scroll position
  const [activeChildIndex, setActiveChildIndex] = useState(0);

  // Ref to store the container element being tracked
  const containerRef = useRef(null);

  // Function to be attached to the container's `onScroll` event to track scroll movements
  const scrollTrack = (e) => {
    // If the container ref is not set yet, assign it the target element of the scroll event
    if (!containerRef.current) containerRef.current = e.target;
    const container = containerRef.current;

    // Update the scroll position state (either scrollTop or scrollLeft depending on the axis)
    setScrollPosition(container[scrollAxis]);

    // Get the offsetTop or offsetLeft of each child element within the container
    const childrenPositions = Array.from(container.children).map(
      (child) => child[offsetAxis]
    );

    // Find the index of the last child whose offset value matches the container's current scroll position
    const newIndex = childrenPositions.findLastIndex(
      // Sticky elements may have the same offset value, so `findLastIndex` ensures the last matching element is selected
      (position) => position === container[scrollAxis]
    );

    // If a valid index is found and it differs from the current one, update the active child index
    if (newIndex !== -1 && newIndex !== activeChildIndex)
      setActiveChildIndex(newIndex);
  };

  // Return the scroll tracking function, current active child index, and scroll position
  return { scrollTrack, activeChildIndex, scrollPosition };
};

export default useScrollTracker;
