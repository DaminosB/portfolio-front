"use client";

import styles from "./SectionWrapper.module.css";

import { useEffect, useRef } from "react";

const SectionWrapper = ({ children, setActiveIndex, index }) => {
  const sectionRef = useRef(null);

  let scrollDebounce = true;

  const handleWheel = (event) => {
    if (scrollDebounce) {
      scrollDebounce = false;

      const sectionTotalHeight = Math.round(sectionRef.current.scrollHeight);
      const distanceFromTop = Math.round(sectionRef.current.scrollTop);
      const sectionClientHeight = Math.round(sectionRef.current.offsetHeight);

      const scrollDirection = event.deltaY > 0 ? "down" : "up";

      switch (scrollDirection) {
        case "down":
          const isAtBottom =
            sectionTotalHeight - distanceFromTop === sectionClientHeight;

          const isLastChild =
            index === sectionRef.current.parentNode.children.length - 1;

          const canScrollDown = isAtBottom && !isLastChild;

          if (canScrollDown) {
            setActiveIndex(index + 1);
          }

          break;

        case "up":
          const isAtTop = distanceFromTop === 0;

          const isFirstChild = index === 0;

          const canScrollUp = isAtTop && !isFirstChild;

          if (canScrollUp) {
            setActiveIndex(index - 1);
          }

          break;

        default:
          break;
      }

      setTimeout(() => {
        scrollDebounce = true;
      }, 1000);
    }
  };

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
      {children}
    </section>
  );
};

export default SectionWrapper;
