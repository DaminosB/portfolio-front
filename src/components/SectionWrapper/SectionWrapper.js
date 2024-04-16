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

  // We don't want the event to trigger our function too much so we set a debounce
  // At first, debounce is true, the rest is detailed lower
  let scrollDebounce = true;

  // This boolean will be updated when the top of the child is reached
  let isAtTop = false;

  // This func is triggered when a wheel event is detected. It checks if the active index needs to be updated
  const handleWheel = (event) => {
    // The func is active only when debounce is true
    if (scrollDebounce) {
      // We give a value false to the debunce so the function cannot be triggered multpile times
      scrollDebounce = false;

      // We set our constants
      const sectionTotalHeight = Math.round(sectionRef.current.scrollHeight);
      const distanceFromTop = Math.round(sectionRef.current.scrollTop);
      const sectionClientHeight = Math.round(sectionRef.current.offsetHeight);

      // We detext the direction of the wheel event
      const scrollDirection = event.deltaY > 0 ? "down" : "up";

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

          // We don't want any unintentional scrolls
          isAtTop = false;

          break;

        case "up":
          // If up, we check if we are not on the 1st child
          const isFirstChild = index === 0;

          // We keep the current value of isAtTop to check if we can scroll up
          const canScrollUp = isAtTop && !isFirstChild;
          // Otherwise, the content can be scrolled up unvoluntarily (the visitor must already be at the top to scroll up)

          if (canScrollUp) {
            setActiveIndex(index - 1);
          }

          // Now we give isAtTop its new value after the wheel event
          isAtTop = distanceFromTop === 0;

          break;

        default:
          break;
      }

      // After 1s, the scrollDebounce is put on true again. It lets us call the function again, without any intempestive calls for that second
      setTimeout(() => {
        scrollDebounce = true;
      }, 1000);
    }
  };

  // We set the event listener
  useEffect(() => {
    sectionRef.current.addEventListener(
      "wheel",
      (event) => handleWheel(event),
      {
        passive: true,
      }
    );

    return sectionRef.current.removeEventListener("wheel", handleWheel);
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
