"use client";
import { ModuleContext } from "../ModuleWrapper/ModuleWrapper";
import styles from "./ModuleColumn.module.css";

import { useRef, useContext, useEffect } from "react";

const ModuleColumn = ({ children }) => {
  const columnRef = useRef(null);

  const { sectionScrollDeltaY } = useContext(ModuleContext);

  // Synchronizes the column's scrolling behavior with the section's scroll state
  useEffect(() => {
    const column = columnRef.current;

    const section = column.closest("section");

    const sibling = Array.from(column.parentNode.children).find(
      (child) => child !== column
    );

    // Determines the overflow height of the sibling element, or defaults to 0 if no sibling is found
    const siblingOverflow = sibling
      ? sibling.scrollHeight - sibling.offsetHeight
      : 0;

    // Calculates the current overflow height of the column
    const currentOverflow = column.scrollHeight - column.offsetHeight;

    const ghostElement = section.querySelector('[data-role="ghost"]');
    if (
      currentOverflow >= siblingOverflow && // Ensures the column's overflow is greater than or equal to its sibling's
      currentOverflow !== ghostElement.offsetHeight // Ensures the ghost element's height is different from the column's overflow
    ) {
      // Updates the ghost element's height to match the column's overflow
      ghostElement.style.height = `${currentOverflow}px`;
    }

    // Handles scroll synchronization between the section and the column
    const scroller = section.querySelector('[data-role="scroller"]');
    const contentBlock = scroller.querySelector("div:first-of-type");

    if (Math.round(contentBlock.offsetTop) === Math.round(scroller.scrollTop)) {
      // If the content block is aligned with the top of the scroller, scroll the column by the deltaY value
      column.scrollBy({ top: sectionScrollDeltaY, behavior: "instant" });
    } else if (contentBlock.offsetTop > scroller.scrollTop) {
      // If the content block is above the scroller's current scroll position, reset the column's scroll position to the top
      column.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [sectionScrollDeltaY]);

  return (
    <div className={styles.column} ref={columnRef}>
      {children}
    </div>
  );
};

export default ModuleColumn;
