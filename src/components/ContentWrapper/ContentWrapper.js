"use client";

import styles from "./ContentWrapper.module.css";

// React hooks imports
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// Components imports
import Slider from "../Slider/Slider";

// This wrapper sets its children to be displayed by a slider div that will translate to show the active part
const ContentWrapper = ({ children }) => {
  // Children are displayed one at a time with a full page effect

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // This state tells which children needs to be displayed. The slide effect is activated at any change.
  const [activeIndex, setActiveIndex] = useState(0);

  // This ref will store the previous activeIndex so the useEffect does not untimely call the sliding func
  const cachedActiveIndex = useRef(null);

  // This ref will store the previous pathname
  const cachedPathname = useRef(pathname);

  // This func translates the content at every activeIndex change
  useEffect(() => {
    // Let's start by declaring the slider element
    const sliderElement = document.getElementById("slider");

    // We define a targetIndex which is the value of activeIndex or a corrected one
    let targetIndex = 0;

    // We may want to delay the slide effect.
    let timer = 0;

    // These conditions will give targetIndex its final value
    // First we check if there is a query
    const queriedSection = searchParams.get("section");
    if (queriedSection) {
      // Then we search its index in the slider children array
      const queriedSectionIndex = Array.from(sliderElement.children).findIndex(
        (section) => section.id === queriedSection
      );

      // If it's there, we set the new active index
      if (queriedSectionIndex !== -1) {
        targetIndex = queriedSectionIndex;

        // If we come from another page, we will stay a fraction of sec on the cover before sliding to requested section
        timer = cachedPathname.current !== pathname ? 750 : 0;
        // Otherwise we want the sliding effect to be immediate
      }
      // Don't forget to reset the query
      router.replace(pathname);
    } else if (activeIndex >= sliderElement.children.length) {
      // At a page change, the activeIndex may be higher than the number of child of the slider div
      // To prevent any error we activate the first index
      targetIndex = 0;
    } else {
      // Otherwise we  keep the value of activeIndex
      targetIndex = activeIndex;
    }

    if (targetIndex !== cachedActiveIndex.current) {
      // We'll calculate its new position with the new targetIndex only if the value has changed
      setTimeout(() => {
        setActiveIndex(targetIndex);
        cachedActiveIndex.current = targetIndex;
      }, timer);
    }

    // Finaly we store the current pathname in its ref
    cachedPathname.current = pathname;
  }, [activeIndex, searchParams, pathname, router]);

  return (
    // This wrapper acts as a window to display the content. It should not overflow the client's screen
    <main className={styles.contentWrapper} id="content-wrapper">
      <Slider activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
        {children}
      </Slider>
    </main>
  );
};

export default ContentWrapper;
