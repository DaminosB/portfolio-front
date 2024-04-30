"use client";

import styles from "./Slider.module.css";

// React hooks imports
import { useEffect, useRef } from "react";

// Utils imports
import changeActiveIndex from "@/utils/changeActiveIndex";
import calcSliderTranslation from "@/utils/calcSliderTranslation";

// This is the conntainer of the sections we are going to display one at a time. It slides at every activeIndex change
const Slider = ({ children, activeIndex, setActiveIndex }) => {
  // For touch evennts. This variable stores the touchstart Y position of the touch. It will be compared to the touchend value later on to determine the direction of the scroll
  let touchstartYPos;
  let touchstartXPos;

  // We don't want the wheel event to trigger our function too much so we set a debouncer
  // At first, debounce is true, it will then be on false so the function won't be triggered
  // let scrollDebounce = true;
  const scrollDebounce = useRef(true);

  // This func is called by the wheel event listener. It's for visitors who view the website on a desktop with a mouse
  const handleWheel = (event) => {
    // The func is active only when debounce is true
    if (scrollDebounce.current) {
      // We prevent untimely calls of the func
      scrollDebounce.current = false;

      // We check if the wheel event is on the Y xis
      if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
        // This key gives us the direction of the wheel event
        const scrollDirection = event.deltaY > 0 ? "down" : "up";
        // scrollDirection = event.deltaY > 0 ? "down" : "up";

        // We call the function that will check if the active index needs to be changed
        const newActiveIndex = changeActiveIndex(scrollDirection, activeIndex);

        let isScrollAllowed = true;
        // Texts being scrollable, we want to make sure we don't jump to another section when the visitor is just scrolling it
        if (event.target.tagName === "P") {
          // So we check with a handler if the scroll is allowed
          isScrollAllowed = textTargetHandler(event.target, scrollDirection);
        }

        // Default is true
        if (isScrollAllowed) {
          if (newActiveIndex !== undefined) setActiveIndex(newActiveIndex);
        }
      }

      // After 1s, the scrollDebounce is put on true again. It lets us call the function again, without any intempestive calls for that second
      setTimeout(() => {
        scrollDebounce.current = true;
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
        touchstartXPos = event.changedTouches[0].pageX;
        break;

      case "touchend":
        // If touchend, we compare the touchstart position with the current event's position
        const touchendYPos = event.changedTouches[0].pageY;
        const touchendXPos = event.changedTouches[0].pageX;

        // We also check if the movement is horizontal or vertical
        const deltaY = touchstartYPos - touchendYPos;
        const deltaX = touchstartXPos - touchendXPos;

        const isVerticalScroll = Math.abs(deltaX) < Math.abs(deltaY);

        if (isVerticalScroll) {
          let scrollDirection;
          if (touchstartYPos < touchendYPos) scrollDirection = "up";
          else if (touchstartYPos > touchendYPos) scrollDirection = "down";

          // Texts being scrollable, we want to make sure we don't jump to another section when the visitor is just scrolling it
          let isScrollAllowed = true;

          if (event.target.tagName === "P") {
            // So we check with a handler if the scroll is allowed
            isScrollAllowed = textTargetHandler(event.target, scrollDirection);
          } else if (event.target.tagName === "BUTTON") {
            // If the viewer touches a button, they don't want the slider to move
            isScrollAllowed = false;
          }
          // Default is true

          if (isScrollAllowed) {
            const newActiveIndex = changeActiveIndex(
              scrollDirection,
              activeIndex
            );

            if (newActiveIndex !== undefined) setActiveIndex(newActiveIndex);
          }
          break;
        }

      default:
        break;
    }
  };

  // Texts are scrollable. We want to be able to scroll them without jumping from sections to sections
  const textTargetHandler = (target, scrollDirection) => {
    // First we get the text container
    const targetParent = target.parentNode;

    // Then we check the distance from the top of the visitor's screen of the displayed element
    const distanceFromTop = Math.round(targetParent.scrollTop);

    // The height of the container
    const textTotalHeight = Math.round(targetParent.scrollHeight);

    // The height displayed on client's screen
    const textClientHeight = Math.round(targetParent.offsetHeight);

    // We set the booleans to check if we are at the top or bottom
    const isContainerAtBottom =
      textTotalHeight - distanceFromTop === textClientHeight;

    const isContainerAtTop = distanceFromTop === 0;

    // If the scroll direction is up, we check if we are at top
    if (scrollDirection === "up") return isContainerAtTop;
    else if (scrollDirection === "down") return isContainerAtBottom;
    // If down, we check if we are at bottom
  };

  // This func will be called at every activeIndex change. It will make a sliding movement to move from section to section
  useEffect(() => {
    // Let's start by declaring the slider element
    const sliderElement = document.getElementById("slider");
    // The active section is nth child of the sliderElement or 0 if undefinned
    const targetSection = sliderElement.children[activeIndex || 0];

    // We give the activeIndex or 0 to this funnc to calculate the sliding movemennt
    calcSliderTranslation(activeIndex || 0);
    // We put event listeners on the active section
    // The wheel events is for mouse compatible devices
    targetSection.addEventListener("wheel", (event) => handleWheel(event), {
      passive: true,
    });

    // Touch events are for tactile devices
    targetSection.addEventListener(
      "touchstart",
      (event) => handleTouchEvents(event),
      { passive: true }
    );

    targetSection.addEventListener("touchend", (event) =>
      handleTouchEvents(event)
    );

    // And we remove the event handlers
    return () => {
      targetSection.removeEventListener("wheel", (event) => handleWheel(event));

      targetSection.removeEventListener("touchstart", (event) =>
        handleTouchEvents(event)
      );

      targetSection.removeEventListener("touchend", (event) =>
        handleTouchEvents(event)
      );
    };
  }, [activeIndex]);

  return (
    <div id="slider" className={styles.slider}>
      {children}
    </div>
  );
};

export default Slider;
