"use client";

import styles from "./ContentWrapper.module.css";

// React hooks imports
import { useState, useEffect, useRef, createContext } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const WrapperContext = createContext();

// This wrapper is the parent of 1 or many sliders. It will handle the coordinates of the section that is to be displayed to the viewer
const ContentWrapper = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // The content is shown one section at a time. This state stores the coordinates of the active one (the one currently displayed)
  const [activeCoordinates, setActiveCoordinates] = useState([0, 0]);

  // The first index is the slider (direct child of the wrapper), the second is the section (direct child of the slider)
  const [activeSliderIndex, activeSectionIndex] = activeCoordinates;

  // This ref will store the previous coordinates so the useEffect does not call the sliding func unecessarily
  const cachedActiveCoordinates = useRef([]);

  const wrapperRef = useRef(null);

  // Children will be able to access and change the active coordinates
  const contextValues = {
    activeCoordinates,
    setActiveCoordinates,
  };

  // This func handles the queries the ContentWrapper could receive. It will displayed the requested the section in the requested slider.
  const handleQueries = (queries, slidersArray) => {
    const { queriedSliderId, queriedSectionId, queriedDelay } = queries;
    // queriedSliderId: String. the id of the slider we want to display. Given through the prop slider=. Mandatory, without it the func is not called.
    // queriedSectionId: String The id of the Section we want to display. Given through the prop section=. If undefined, the dispalyed section will be index 0.
    // queriedDelay: Number. In milliseconds, the delay we want to apply to the sliding effect. It avoids any uncomfortable blinking of the content. Default is 0.

    // First we search the queriedSlider index in the slidersArray
    const queriedSliderIndex = Array.from(slidersArray).findIndex(
      (slider) => slider.id === queriedSliderId
    );

    if (queriedSliderIndex !== -1) {
      // If the slider is identified, we execute the rest of the code

      // These are the newCoordinates we are going to set
      const newActiveCoords = [];

      // A delay may be requested, so we put a variable
      let timer = 0;

      // The first entry of the new active coords is the queried slider
      newActiveCoords.push(queriedSliderIndex);

      // This is the dom element of the queried slider
      const queriedSlider = slidersArray[queriedSliderIndex];

      // We use it to check if one of its children has the id given in the queries
      const queriedSectionIndex = Array.from(queriedSlider.children).findIndex(
        (section) => section.id === queriedSectionId
      );

      // If so we push the resulat as the second entry
      if (queriedSectionIndex !== -1) newActiveCoords.push(queriedSectionIndex);
      else newActiveCoords.push(0);
      // Otherwise, we activate the first section of the slider

      // We check if a delay is needed to display the desired content
      if (queriedDelay) timer = queriedDelay;
      // Otherwise we want the sliding effect to be immediate

      // Don't forget to reset the query
      router.replace(pathname);

      setTimeout(() => {
        setActiveCoordinates(newActiveCoords);
      }, timer);
    }
  };

  // This func displays the right content according to the active coordinates state
  useEffect(() => {
    // Let's start by declaring the wrapper element
    const element = wrapperRef.current;

    // The children of the wrapper are the sliders whose children are sections
    const slidersArray = Array.from(element.children);

    // Let's destructure the cache array
    const [prevActiveSliderIndex] = cachedActiveCoordinates.current;

    // We store any queries that could have been transmitted
    const queries = {
      queriedSliderId: searchParams.get("slider"),
      queriedSectionId: searchParams.get("section"),
      queriedDelay: searchParams.get("delay"),
    };

    // If a slider is requested, we send the queries object to this func.
    if (queries.queriedSliderId) handleQueries(queries, slidersArray);

    // If we observe a change of active Slider, we call the displaying function
    if (activeSliderIndex !== prevActiveSliderIndex) {
      // We'll calculate its new position with the new targetIndex only if the value has changed
      displayActiveSlider(slidersArray, activeSliderIndex);
      cachedActiveCoordinates.current = activeCoordinates;
    }
  }, [searchParams, activeSliderIndex]);

  return (
    // This wrapper acts as a window to display the content. It should not overflow the client's screen
    <WrapperContext.Provider value={contextValues}>
      <main
        className={styles.contentWrapper}
        ref={wrapperRef}
        id="content-wrapper"
      >
        {children}
      </main>
    </WrapperContext.Provider>
  );
};

const displayActiveSlider = (slidersArray, activeSliderIndex) => {
  slidersArray.map((child, index) => {
    // We want to make a layering effect, between each slider (each one will be put on top of the previous one)
    if (index <= activeSliderIndex) {
      // If the slider is placed before or is the active one, it's placed at the top of the window
      child.style.top = `0%`;
    } else if (index > activeSliderIndex) {
      // Otherwise, it's placed below the window
      child.style.top = "100%";
    }
  });
};

export default ContentWrapper;
