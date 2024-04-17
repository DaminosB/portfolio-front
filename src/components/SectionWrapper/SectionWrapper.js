import styles from "./SectionWrapper.module.css";

// React hooks imports
import { useEffect, useRef } from "react";

// Components imports
import SectionSwiper from "../SectionSwiper/SectionSwiper";

const SectionWrapper = ({
  children,
  numberOfSiblings,
  setActiveIndex,
  index,
  style,
}) => {
  // numberOfSiblings: Number. The number of children in the parent
  // setACtiveIndex: Func. Updates which child should be displayed
  // Index: Number. The index of the child
  // style: Object. The style informations got through a request to the back

  // This ref is the whole returned compenent
  const sectionRef = useRef(null);

  // We set the object that will set the height of the spacer div
  const customStyles = { height: `${style.headerHeight}px` };

  // This variable stores the touchstart Y position of the touch. It will be compared to the touchend value later on to determine the direction of the scroll
  let touchstartYPos;

  // We don't want the wheel event to trigger our function too much so we set a debounce
  // At first, debounce is true, the rest is detailed lower
  let scrollDebounce = true;

  // This func is called by the wheel event listener. It's for visitors who view the website on a desktop with a mouse
  const handleWheel = (event) => {
    if (scrollDebounce) {
      // The func is active only when debounce is true
      scrollDebounce = false;

      // This key gives us the direction of the wheel event
      const scrollDirection = event.deltaY > 0 ? "down" : "up";

      // We call the function that will check if the active index needs to be changed
      allowIndexChange(scrollDirection);

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

        // We use it to deduct the direction of the scroll
        if (touchstartYPos < touchendYPos) allowIndexChange("up");
        else if (touchstartYPos > touchendYPos) allowIndexChange("down");

        break;

      default:
        break;
    }
  };

  // This func is called after the wheel or touch events. It checks if the activeIndex needs to be updated
  // It's updated if we are at the top or bottom of the section and the scroll is in the right difrection
  const allowIndexChange = (scrollDirection) => {
    // First we check the distance from the top of the visitor's screen of the displayed element
    const distanceFromTop = Math.round(sectionRef.current.scrollTop); // First we need to set theses variables
    // The height of the content of the section
    const sectionTotalHeight = Math.round(sectionRef.current.scrollHeight);

    // The height displayed on client's screen
    const sectionClientHeight = Math.round(sectionRef.current.offsetHeight);

    // Then 2 scenarios according to the scroll direction
    switch (scrollDirection) {
      case "down":
        // If down we check if we are at the bottom of the displayed child
        const isAtBottom =
          sectionTotalHeight - distanceFromTop === sectionClientHeight;

        // We check if we are not on the last parent's child
        const isLastChild =
          index === sectionRef.current.parentNode.children.length - 1;

        // If parameters are ok, we set a new activeIndex to the displayer
        const canScrollDown = isAtBottom && !isLastChild;

        if (canScrollDown) {
          setActiveIndex(index + 1);
        }

        break;

      case "up":
        // If up, we check if we are not on the 1st child
        const isFirstChild = index === 0;

        // The we check if we are at the top of the section
        const isAtTop = distanceFromTop === 0;

        // If parameters are ok, we set a new activeIndex to the displayer
        const canScrollUp = isAtTop && !isFirstChild;

        if (canScrollUp) {
          setActiveIndex(index - 1);
        }

        break;

      default:
        break;
    }
  };

  // We set the event listeners
  useEffect(() => {
    if (sectionRef.current) {
      // The wheel events is for mouse compatible devices
      sectionRef.current.addEventListener(
        "wheel",
        (event) => handleWheel(event),
        { passive: true }
      );

      // Touch events are for tactile devices
      sectionRef.current.addEventListener(
        "touchstart",
        (event) => handleTouchEvents(event),
        { passive: true }
      );

      sectionRef.current.addEventListener("touchend", (event) =>
        handleTouchEvents(event)
      );

      // Remove event listeners
      return () => {
        sectionRef.current.removeEventListener("wheel", (event) =>
          handleWheel(event)
        );

        sectionRef.current.removeEventListener("touchstart", (event) =>
          handleTouchEvents(event)
        );

        sectionRef.current.removeEventListener("touchend", (event) =>
          handleTouchEvents(event)
        );
      };
    }
  }, []);

  return (
    <section className={styles.sectionWrapper} ref={sectionRef}>
      {/* 1st child (the cover) needs a spacer div to let the header be normaly displayed */}
      {index === 0 && <div className="spacer" style={customStyles}></div>}
      {children}
      {/* If we are not on the last child, we can slide down */}
      {index < numberOfSiblings - 1 && (
        <SectionSwiper setActiveIndex={setActiveIndex} style={style} />
      )}
    </section>
  );
};

export default SectionWrapper;
