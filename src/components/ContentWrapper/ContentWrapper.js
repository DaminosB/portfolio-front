"use client";

import SectionSwiper from "../SectionSwiper/SectionSwiper";
import SectionWrapper from "../SectionWrapper/SectionWrapper";
import styles from "./ContentWrapper.module.css";

import { Children, useState, useEffect, useRef } from "react";

const ContentWrapper = ({ children, style }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef(null);

  useEffect(() => {
    const element = sliderRef.current;

    const activeSectionTopPosition = element.children[activeIndex].offsetTop;

    element.style.transform = `translateY(${-activeSectionTopPosition}px)`;
  }, [activeIndex]);

  return (
    <main className={styles.contentWrapper}>
      <div className={styles.slider} ref={sliderRef}>
        {Children.map(children, (child, index) => {
          console.log(children);
          return (
            <SectionWrapper setActiveIndex={setActiveIndex} index={index}>
              {index > 0 && (
                <SectionSwiper
                  direction="up"
                  setActiveIndex={() => setActiveIndex(index - 1)}
                  style={style}
                  text="Remonter"
                />
              )}
              {child}
              {index < children.length - 1 && (
                <SectionSwiper
                  direction="down"
                  setActiveIndex={() => setActiveIndex(index + 1)}
                  style={style}
                  text="Voir les travaux"
                />
              )}
            </SectionWrapper>
          );
        })}
      </div>
    </main>
  );
};

export default ContentWrapper;
