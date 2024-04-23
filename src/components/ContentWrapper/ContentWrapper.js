"use client";

import styles from "./ContentWrapper.module.css";

// React hooks imports
import { useState, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";

// Utils imports
import changeActiveIndex from "@/utils/changeActiveIndex";
import calcSliderTranslation from "@/utils/calcSliderTranslation";

// This wrapper sets its children to be displayed by a slider div that will translate to show the active part
const ContentWrapper = ({ children }) => {
  // Children are displayed one at a time with a full page effect
  // style: Object. The style informations got through a request to the back
  // profile: Object. The profile informations got through a request to the back

  const router = useRouter();
  const searchParams = useSearchParams();

  // This state tells which children needs to be displayed
  const [activeIndex, setActiveIndex] = useState(0);

  // This variable stores the touchstart Y position of the touch. It will be compared to the touchend value later on to determine the direction of the scroll
  let touchstartYPos;

  // We don't want the wheel event to trigger our function too much so we set a debounce
  // At first, debounce is true, the rest is detailed lower
  let scrollDebounce = true;

  // This func is called by the wheel event listener. It's for visitors who view the website on a desktop with a mouse
  const handleWheel = (event) => {
    // The func is active only when debounce is true
    if (scrollDebounce) {
      // We prevent untimely calls of the func
      scrollDebounce = false;

      // This key gives us the direction of the wheel event
      const scrollDirection = event.deltaY > 0 ? "down" : "up";

      // We call the function that will check if the active index needs to be changed
      const newActiveIndex = changeActiveIndex(scrollDirection, activeIndex);

      if (newActiveIndex !== undefined) setActiveIndex(newActiveIndex);

      // After 1s, the scrollDebounce is put on true again. It lets us call the function again, without any intempestive calls for that second
      setTimeout(() => {
        scrollDebounce = true;
      }, 1000);
    }
  };

  // This func is called by the touch events listeners. It's for visitors who view the website on a tactile device
  const handleTouchEvents = (event) => {
    // The same func is called by the touchstart and touchend listeners
    switch (event.type) {
      case "touchstart":
        // If touchstart, we store the coordinates of the touch event in this variable
        touchstartYPos = event.changedTouches[0].pageY;
        break;

      case "touchend":
        // If touchend, we compare the touchstart position with the current event's position
        const touchendYPos = event.changedTouches[0].pageY;

        let scrollDirection;
        if (touchstartYPos < touchendYPos) scrollDirection = "up";
        else if (touchstartYPos > touchendYPos) scrollDirection = "down";

        const newActiveIndex = changeActiveIndex(scrollDirection, activeIndex);

        if (newActiveIndex !== undefined) setActiveIndex(newActiveIndex);
        break;

      default:
        break;
    }
  };

  const eventHandlers = (activeSection) => {
    // The wheel events is for mouse compatible devices
    activeSection.addEventListener("wheel", (event) => handleWheel(event), {
      passive: true,
    });

    // Touch events are for tactile devices
    activeSection.addEventListener(
      "touchstart",
      (event) => handleTouchEvents(event),
      { passive: true }
    );

    activeSection.addEventListener("touchend", (event) =>
      handleTouchEvents(event)
    );
  };

  const cleanUp = (activeSection) => {
    activeSection.removeEventListener("wheel", (event) => handleWheel(event));

    activeSection.removeEventListener("touchstart", (event) =>
      handleTouchEvents(event)
    );

    activeSection.removeEventListener("touchend", (event) =>
      handleTouchEvents(event)
    );
  };

  // This func translates the content at every activeIndex change
  useEffect(() => {
    // Let's start by declaring the slider element
    const sliderElement = document.getElementById("slider");

    // If the URL contains a query, we check if the slider should slide to it
    // First we get the query
    const queriedSection = searchParams.get("section");

    // Then we search its index in the slider children array
    const queriedSectionIndex = Array.from(sliderElement.children).findIndex(
      (section) => section.id === queriedSection
    );

    // If it's there, we set the new active index
    if (queriedSectionIndex !== -1) {
      setActiveIndex(queriedSectionIndex);

      // Don't forget to reset the query
      router.replace("/");
    }

    // The active section is nth child of the sliderElement
    const activeSection = sliderElement.children[activeIndex];

    // We'll calculate its new position with the new activeIndex
    calcSliderTranslation(activeIndex);
    // calcSliderPosition(sliderElement);

    // We put event listeners on the active section
    eventHandlers(activeSection);

    // And we remove them
    return cleanUp(activeSection);
  }, [activeIndex, searchParams]);

  return (
    // This wrapper acts as a window to display the content. It should not overflow the client's screen
    <main className={styles.contentWrapper} id="content-wrapper">
      {children}
    </main>
  );
};

export default ContentWrapper;
