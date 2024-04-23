"use client";

import styles from "./Logo.module.css";

// React hooks imports
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// This component displays a logo that sends the visitor back to the homepage's cover
const Logo = ({ logo }) => {
  // logo: Object. The logo's infos to display it. Got through a request to the back

  const router = useRouter();

  const logoDivRef = useRef(null);

  // We send the visitor back to the cover with a query
  const handleOnClick = () => {
    router.replace("/?section=cover-container");
  };

  // This useEffect gives the logo div its final top position
  useEffect(() => {
    const element = logoDivRef.current;

    // The logo must be placed in the middle of the header
    const headerHeight = document.getElementById("header").offsetHeight;
    element.style.top = `${headerHeight / 2}px`;
    element.style.transform = "translateY(-50%)";
  });

  return (
    <div className={styles.logo} ref={logoDivRef}>
      {/* On click, we are sent back to the cover */}
      <button onClick={handleOnClick}>
        <img src={logo.url} alt="" />
      </button>
    </div>
  );
};

export default Logo;
