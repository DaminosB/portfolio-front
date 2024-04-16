"use client";

import styles from "./CoverContainer.module.css";

import { useRef, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

const CoverContainer = ({ profile }) => {
  const router = useRouter();

  const coverContainerRef = useRef(null);

  // const handleScroll = (domElement) => {
  //   const elementRect = domElement.getBoundingClientRect();
  //   const siblingRect = domElement.nextSibling.getBoundingClientRect();

  //   const opacityValue = Math.min(
  //     1,
  //     Math.max(0, siblingRect.top / elementRect.bottom)
  //   );

  //   domElement.style.opacity = opacityValue;
  //   console.log(opacityValue);
  // };

  // const handleScroll = (event, domElement) => {
  //   const elementRect = domElement.getBoundingClientRect();

  //   const siblingElement = domElement.nextSibling;
  //   const siblingRect = siblingElement.getBoundingClientRect();

  //   // const { top, bottom } = domElement.nextSibling.getBoundingClientRect();
  //   const windowHeight = window.innerHeight;

  //   const isSiblingVisible = siblingRect.top < windowHeight;
  //   const isElementVisible = elementRect.bottom < windowHeight;

  //   const scrollDirection = event.deltaY > 0 ? "down" : "up";

  //   if (scrollDirection === "down" && isSiblingVisible) {
  //     // router.replace("#projects-container");
  //     siblingElement.scrollIntoView({ behavior: "smooth" });
  //   } else if (scrollDirection === "up" && isElementVisible) {
  //     domElement.scrollTo({ top: 0, behavior: "smooth" });
  //     // domElement.scrollIntoView({ behavior: "smooth" });
  //     // router.replace("#cover-container");
  //   }

  //   console.log(scrollDirection);
  // };

  // useEffect(() => {
  // const scrollerDiv = coverContainerRef.current.parentNode;

  // scrollerDiv.addEventListener("scroll", () =>
  //   handleScroll(coverContainerRef.current)
  // );
  // return () => {
  //   scrollerDiv.removeEventListener("scroll", () =>
  //     handleScroll(coverContainerRef.current)
  //   );
  // };

  // window.addEventListener("scroll", () =>
  //   handleScroll(coverContainerRef.current)
  // );
  // return () => {
  //   window.removeEventListener("scroll", () =>
  //     handleScroll(coverContainerRef.current)
  //   );
  // };

  // window.addEventListener("wheel", (event) =>
  //   handleScroll(event, coverContainerRef.current)
  // );
  // return () => {
  //   window.removeEventListener("wheel", () =>
  //     handleScroll(coverContainerRef.current)
  //   );
  // };

  // window.addEventListener("wheel", handleScroll);
  // return () => {
  //   window.removeEventListener("wheel", handleScroll);
  // };
  // }, []);

  return (
    <div
      className={styles.coverContainer}
      ref={coverContainerRef}
      id="cover-container"
    >
      <img src={profile.cover.url} alt={profile.cover.alternativeText} />
    </div>
  );
};

export default CoverContainer;
