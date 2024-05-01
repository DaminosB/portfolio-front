// "use client";

// import styles from "./ContentWrapper.module.css";

// // React hooks imports
// import { useState, useEffect, useRef } from "react";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";

// // Components imports
// import Slider from "../Slider/Slider";

// // This wrapper sets its children to be displayed by a slider div that will translate to show the active part
// const ContentWrapper = ({ children }) => {
//   // Children are displayed one at a time with a full page effect

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();

//   // This state tells which children needs to be displayed. The slide effect is activated at any change.
//   const [activeIndex, setActiveIndex] = useState(0);

//   // This ref will store the previous activeIndex so the useEffect does not call the sliding func unecessarily
//   const cachedActiveIndex = useRef(null);

//   // This func translates the content at every activeIndex change
//   useEffect(() => {
//     // Let's start by declaring the slider element
//     const sliderElement = document.getElementById("slider");

//     // We define a targetIndex which is the value of activeIndex or a corrected one
//     let targetIndex = 0;

//     // We may want to delay the slide effect.
//     let timer = 0;

//     // These conditions will give targetIndex its final value
//     // First we check if there is a query
//     const queriedSection = searchParams.get("section");
//     if (queriedSection) {
//       // Then we search its index in the slider children array
//       const queriedSectionIndex = Array.from(sliderElement.children).findIndex(
//         (section) => section.id === queriedSection
//       );

//       // If it's there, we set the new active index
//       if (queriedSectionIndex !== -1) {
//         targetIndex = queriedSectionIndex;

//         // We check if a delay is needed for the slider to move into final position
//         const delay = searchParams.get("delay") === "true";
//         // The query gives us a string, so we compare it to another string to get a boolean

//         if (delay) timer = 750;
//         // Otherwise we want the sliding effect to be immediate
//       }
//       // Don't forget to reset the query
//       router.replace(pathname);
//     } else {
//       // Otherwise we  keep the value of activeIndex
//       targetIndex = activeIndex;
//     }

//     if (targetIndex !== cachedActiveIndex.current) {
//       // We'll calculate its new position with the new targetIndex only if the value has changed
//       setTimeout(() => {
//         setActiveIndex(targetIndex);
//         cachedActiveIndex.current = targetIndex;
//       }, timer);
//     }
//   }, [activeIndex, searchParams, pathname, router]);

//   return (
//     // This wrapper acts as a window to display the content. It should not overflow the client's screen
//     <main className={styles.contentWrapper} id="content-wrapper">
//       <Slider activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
//         {children}
//       </Slider>
//     </main>
//   );
// };

// export default ContentWrapper;

"use client";

import styles from "./ContentWrapper.module.css";

// React hooks imports
import { useState, useEffect, useRef, createContext } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const WrapperContext = createContext();

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
  const [activeSectionId, setactiveSectionId] = useState();

  const contextValues = { activeSectionId };

  // This ref will store the previous activeIndex so the useEffect does not call the sliding func unecessarily
  const cachedActiveIndex = useRef(null);

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

        // We check if a delay is needed for the slider to move into final position
        const delay = searchParams.get("delay") === "true";
        // The query gives us a string, so we compare it to another string to get a boolean

        if (delay) timer = 750;
        // Otherwise we want the sliding effect to be immediate
      }
      // Don't forget to reset the query
      router.replace(pathname);
    } else {
      // Otherwise we  keep the value of activeIndex
      targetIndex = activeIndex;
    }

    if (targetIndex !== cachedActiveIndex.current) {
      // We'll calculate its new position with the new targetIndex only if the value has changed
      setTimeout(() => {
        setActiveIndex(targetIndex);
        setactiveSectionId(sliderElement.children[activeIndex].id);
        cachedActiveIndex.current = targetIndex;
      }, timer);
    }
  }, [activeIndex, searchParams, pathname, router]);

  return (
    // This wrapper acts as a window to display the content. It should not overflow the client's screen
    <WrapperContext.Provider value={contextValues}>
      <main className={styles.contentWrapper} id="content-wrapper">
        <Slider activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
          {children}
        </Slider>
      </main>
    </WrapperContext.Provider>
  );
};

export default ContentWrapper;
