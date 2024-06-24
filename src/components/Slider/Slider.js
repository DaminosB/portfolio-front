"use client";

import styles from "./Slider.module.css";

// React hooks imports
import { useEffect, useRef, useState, useContext } from "react";

import { WrapperContext } from "../ContentWrapper/ContentWrapper";

// This is the conntainer of the sections we are going to display one at a time. It slides at every active section index change
const Slider = ({ children, id, hideOnInactive, hideHeader }) => {
  // id: String. The id of the slider so it's not mistaken for another one as it's called.
  // hidenOnInactive: Boolean. The slider fades when it's not active.
  // hideHeader: Boolean. When the slider is active, the header is hidden

  // This state is true when the slider is the one currently being displayed
  const [isActiveSlider, setIsActiveSlider] = useState(false);
  // const [displayedSection, setDisplayedSection] = useState(0);

  const cachedSection = useRef(0);

  const { activeCoordinates, setActiveCoordinates, setShowHeader } =
    useContext(WrapperContext);

  // The first index is the active slider (direct child of the wrapper), the second one is the active section in the active slider
  const [activeSliderIndex, activeSectionIndex] = activeCoordinates;

  // We don't want the wheel event to trigger our function too much so we set a debouncer
  // At first, debounce is true, it will then be on false so the function won't be triggered
  const scrollDebounce = useRef(true);

  const sliderRef = useRef(null);

  // This will store the topPositions of each section so the slider knows where to stop.
  const sectionsTopPositions = useRef(null);

  // For touch events. This variable stores the touchstart Y position of the touch. It will be compared to the touchend value later on to determine the direction of the scroll
  let touchstartYPos;
  let touchstartXPos;

  const handleWheel = (event) => {
    // The func is active only when debounce is true
    if (scrollDebounce.current) {
      // We prevent untimely calls of the func
      scrollDebounce.current = false;

      // We check if the wheel event is on the Y xis
      if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
        // This key gives us the direction of the wheel event
        const scrollDirection = event.deltaY > 0 ? "down" : "up";

        const newActiveCoordinates = changeActiveCoordinates(
          scrollDirection,
          activeCoordinates
        );

        if (newActiveCoordinates) setActiveCoordinates(newActiveCoordinates);

        let isScrollAllowed = true;
        // Texts being scrollable, we want to make sure we don't jump to another section when the visitor is just scrolling it
        if (event.target.tagName === "P") {
          // So we check with a handler if the scroll is allowed
          isScrollAllowed = textTargetHandler(event.target, scrollDirection);
        }
      }

      // After 1s, the scrollDebounce is put on true again. It lets us call the function again, without any intempestive calls for that second
      setTimeout(() => {
        scrollDebounce.current = true;
      }, 1000);
    }
  };

  // This func is called by the touch events listeners. It's for visitors who view the website on a tactile device
  // The same func is called by the touchstart and touchend listeners
  const handleTouchEvents = (event) => {
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

          const contentWrapper = document.getElementById("content-wrapper");

          const indexInParent = Array.from(contentWrapper).findIndex(
            (child) => child.id === id
          );

          const numberOfSiblings = Array.from(contentWrapper).length;

          if (event.target.tagName === "P") {
            // So we check with a handler if the scroll is allowed
            isScrollAllowed = textTargetHandler(event.target, scrollDirection);
          } else if (event.target.tagName === "BUTTON") {
            // If the viewer touches a button, they don't want the slider to move
            isScrollAllowed = false;
          } else if (indexInParent === numberOfSiblings - 1) {
            isScrollAllowed = false;
          }
          const newActiveCoordinates = changeActiveCoordinates(
            scrollDirection,
            activeCoordinates
          );

          if (newActiveCoordinates) setActiveCoordinates(newActiveCoordinates);
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

  // This func will be called at every active section index change. It will make a sliding movement to move from section to section
  useEffect(() => {
    // Let's start by declaring the slider element
    const element = sliderRef.current;

    // Then an array containing all its children (the sections)
    const sectionsArray = Array.from(element.children);

    // The component's index in its parent, the Co,ntentWrapper
    const sliderIndex = findSliderIndex(id);

    // The header element of the document
    const [headerNode] = document.getElementsByTagName("HEADER");

    // If the sectionsTopPositions ref array is not defined yet, we populate it
    // if (headerHeight !== null) {
    if (!sectionsTopPositions.current) {
      // The ContentWrapper can display multiple sliders, each with a potentially different hideHeader prop value.
      // When calculating each section's top position, we need to account for this difference.
      const heightOffset = hideHeader
        ? // ? headerHeight // Use the exact height of the header if it is visible
          Math.floor(headerNode.getBoundingClientRect().height) // Use the exact height of the header if it is visible
        : 0; // No height offset if the header is hidden

      // We call the populate func with the data we have gathered
      sectionsTopPositions.current = populateSectionsTopPositions(
        sectionsArray,
        heightOffset
      );
    }

    // This will check if the slider is the currently active one (if it's being displayed)
    const isActiveSlider = sliderIndex === activeSliderIndex;

    // Calculate and apply the speed and translate coordinates of the slider
    // If there are many sections to scroll, we want to lengthen the transition duration.
    let transformTransitionDuration = 0;
    // Default duration for all animations (in ms)
    const DEFAULT_TRANSITION_DURATION = 750;
    // Duration multiplier for active slider transitions (in ms)
    const ACTIVE_SLIDER_MULTIPLIER = 300;
    // Duration multiplier for inactive slider transitions (in ms)
    const INACTIVE_SLIDER_MULTIPLIER = 200;

    // Translate the slider on the Y axis to display the desired section
    if (isActiveSlider) {
      // If the slider is active

      // Calculate the number of sections jumped by finding the difference between the previous active index and the new one
      const sectionsJumped = Math.abs(
        cachedSection.current - activeSectionIndex
      );

      // Calculate the transition duration based on the sections jumped
      transformTransitionDuration = sectionsJumped * ACTIVE_SLIDER_MULTIPLIER;

      // Calculate the new translate Y value to slide to the new active section
      const newTranslateY = sectionsTopPositions.current[activeSectionIndex];
      element.style.transform = `translateY(${newTranslateY}px)`;
      // element.style.zIndex = 1;

      // Set the slider's active state to true
      setIsActiveSlider(true);
      cachedSection.current = activeSectionIndex;
    } else if (sliderIndex > activeSliderIndex) {
      // If the slider is after the currently active one, translate it to the first section (index 0)

      // Calculate the number of sections jumped (previous active section index)
      const sectionsJumped = cachedSection.current;

      // Calculate the transition duration based on the sections jumped
      transformTransitionDuration = sectionsJumped * INACTIVE_SLIDER_MULTIPLIER;

      // Calculate the new translate Y value to slide to the first section
      const newTranslateY = sectionsTopPositions.current[0];
      element.style.transform = `translateY(${newTranslateY}px)`;

      // Set the slider's active state to false
      // element.style.zIndex = 0;
      setIsActiveSlider(false);
      cachedSection.current = 0;
    } else if (sliderIndex < activeSliderIndex) {
      // If the slider is before the currently active one, translate it to the last section

      // Get the last section index
      const lastSectionIndex = sectionsArray.length - 1;

      // Calculate the number of sections jumped (difference between previous active section and last section)
      const sectionsJumped = lastSectionIndex - cachedSection.current;

      // Calculate the transition duration based on the sections jumped
      transformTransitionDuration = sectionsJumped * INACTIVE_SLIDER_MULTIPLIER;

      // Calculate the new translate Y value to slide to the last section
      const newTranslateY = sectionsTopPositions.current[lastSectionIndex];
      // element.style.zIndex = 0;
      element.style.transform = `translateY(${newTranslateY}px)`;

      // Set the slider's active state to false
      setIsActiveSlider(false);
      cachedSection.current = lastSectionIndex;
    }

    // Ensure the transition duration is not shorter than the default duration
    if (transformTransitionDuration < DEFAULT_TRANSITION_DURATION) {
      transformTransitionDuration = DEFAULT_TRANSITION_DURATION;
    }

    // Apply the calculated transition duration
    element.style.transition = `${DEFAULT_TRANSITION_DURATION}ms, transform ${transformTransitionDuration}ms`;

    // These are the parameters we can give to the component
    // The slider fades away when it's no longer active
    if (hideOnInactive) {
      if (isActiveSlider) element.classList.remove("hidden");
      else element.classList.add("hidden");
    }

    // The slider hides the header when active
    if (hideHeader && isActiveSlider) {
      setShowHeader(false);
    } else if (!hideHeader && isActiveSlider) {
      setShowHeader(true);
    }
    // }
  }, [activeSliderIndex, activeSectionIndex]);

  return (
    <div
      id={id}
      className={`${styles.slider}`}
      ref={sliderRef}
      onWheel={isActiveSlider ? handleWheel : undefined}
      onTouchStart={isActiveSlider ? handleTouchEvents : undefined}
      onTouchEnd={isActiveSlider ? handleTouchEvents : undefined}
    >
      {children}
    </div>
  );
};

// This function populates the sectionsTopPositions ref array with the top positions of each section
const populateSectionsTopPositions = (sectionsArray, heightOffset) => {
  // sectionsArray: Array of the component's direct children
  // heightOffset: Number, the vertical offset to account for (0 or the header's height)

  const response = [];

  // The sections are displayed one below another.
  // Their top position is determined by the cumulative height of all previous sections.
  let cumulativeHeight = 0;

  sectionsArray.forEach((child) => {
    // The top position of the current child is the cumulative height so far.
    response.push(cumulativeHeight);

    // Update cumulativeHeight by adding the current child's height and the height offset.
    cumulativeHeight -= child.offsetHeight + heightOffset;
  });

  // Return the array of top positions.
  return response;
};

const findSliderIndex = (sliderId) => {
  const slidersArray = Array.from(
    document.getElementById("content-wrapper").children
  );

  return slidersArray.findIndex((slider) => slider.id === sliderId);
};

// This func is called after the wheel or touch events. It checks if the activeIndex needs to be updated
// It's updated if we are at the top or bottom of the section and the scroll is in the right direction
const changeActiveCoordinates = (scrollDirection, activeCoordinates) => {
  const contentWrapper = document.getElementById("content-wrapper");
  const [activeSliderIndex, activeSectionIndex] = activeCoordinates;
  const activeSlider = contentWrapper.children[activeSliderIndex];
  const activeSection = activeSlider.children[activeSectionIndex];

  // First we check the distance from the top of the visitor's screen of the displayed element
  const distanceFromTop = Math.round(activeSection.scrollTop); // First we need to set theses variables
  // The height of the content of the section
  const sectionTotalHeight = Math.round(activeSection.scrollHeight);

  // The height displayed on client's screen
  const sectionClientHeight = Math.round(activeSection.offsetHeight);

  // Then 2 scenarios according to the scroll direction
  switch (scrollDirection) {
    case "down":
      const visibleSectionHeight = sectionTotalHeight - distanceFromTop;
      // If down we check if we are at the bottom of the displayed child
      const marginOfError = 1;
      const isAtBottom =
        Math.abs(visibleSectionHeight - sectionClientHeight) <= marginOfError;

      if (isAtBottom) {
        // If we are at the bottom of the active section, we check if we go to another section, or another slider.
        const lastSliderIndex = Array.from(contentWrapper.children).length - 1;
        const lastSectionIndex = Array.from(activeSlider.children).length - 1;

        if (lastSectionIndex > activeSectionIndex) {
          // If we are not on the last section of the active slider, the next section becomes the active one
          return [activeSliderIndex, activeSectionIndex + 1];
        } else if (lastSliderIndex > activeSliderIndex) {
          // Otherwise we check if there is another slider and if so, this one becomes the active one
          return [activeSliderIndex + 1, 0];
        }
      }
      // All other cases : the active coordinates remain the same

      break;

    case "up":
      // If up, first we check if we are at the top of the section
      const isAtTop = distanceFromTop === 0;

      if (isAtTop) {
        // If the viewer is a the top of the active section, we check if there is another section before the active one
        if (activeSectionIndex > 0) {
          // If so, the previous section becomes the active one
          return [activeSliderIndex, activeSectionIndex - 1];
        } else if (activeSliderIndex > 0) {
          // Otherwise, we check if there is another slider before the active one
          // We want the last section of the new active slider to be active
          const lastSectionIndex =
            Array.from(contentWrapper.children[activeSliderIndex - 1].children)
              .length - 1;
          return [activeSliderIndex - 1, lastSectionIndex];
        }
      }
      // All other scenarios : the active coordinates remain the same

      break;

    default:
      break;
  }
};

export default Slider;
