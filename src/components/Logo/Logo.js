"use client";

import styles from "./Logo.module.css";

// React hooks imports
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// This component displays a logo that sends the visitor back to the homepage's cover
const Logo = ({ logo, style }) => {
  // logo: Object. The logo's infos to display it. Got through a request to the back

  const pathname = usePathname();

  const [shortcutURL, setShortcutURL] = useState("");
  const [displayText, setDisplayText] = useState("");

  const logoDivRef = useRef(null);

  // We store the headerHeight so the position is not untimely recalculed
  const headerHeight = useRef(0);

  const customStyles = {
    backgroundColor: style.defaultBackgroundColor,
    color: style.defaultFontColor,
  };

  // This useEffect gives the logo div its final top position and sets the Redirection URL
  useEffect(() => {
    if (!headerHeight.current) {
      const element = logoDivRef.current;

      // The logo must be placed in the middle of the header
      headerHeight.current = document.getElementById("header").offsetHeight;
      element.style.top = `${headerHeight.current / 2}px`;
      element.style.transform = "translateY(-50%)";
    }

    if (pathname === "/") {
      setShortcutURL("/?section=cover-container");
      setDisplayText("Menu");
    } else if (pathname.includes("projects")) {
      setShortcutURL("/?section=projects-container&delay=true");
      setDisplayText("Créations");
    }
  });

  return (
    <div className={styles.logo} ref={logoDivRef}>
      <Link href={shortcutURL}>
        <img src={logo.url} alt="" />
      </Link>
      <span style={customStyles}>{displayText}</span>
    </div>
  );
};

export default Logo;
