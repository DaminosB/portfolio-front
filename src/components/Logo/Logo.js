"use client";

import styles from "./Logo.module.css";

// React hooks imports
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// This component displays a logo that sends the visitor back to the homepage's cover
const Logo = ({ logo }) => {
  // logo: Object. The logo's infos to display it. Got through a request to the back

  const router = useRouter();
  const pathname = usePathname();

  const [shortcutURL, setShortcutURL] = useState("");

  const logoDivRef = useRef(null);

  // We store the headerHeight so the position is not untimely recalculed
  const headerHeight = useRef(0);

  // We send the visitor back to the cover with a query
  const handleOnClick = () => {
    let request;
    if (pathname === "/") {
      router.replace("/?section=cover-container");
    } else if (pathname.includes("projects")) {
      router.replace("/?section=projects-container");
    }
  };
  // const url = useRef("");

  // This useEffect gives the logo div its final top position
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
    } else if (pathname.includes("projects")) {
      setShortcutURL("/?section=projects-container");
    }
  });

  return (
    <div className={styles.logo} ref={logoDivRef}>
      {/* On click, we are sent back to the cover */}
      <button
      // onClick={handleOnClick}
      >
        <Link href={shortcutURL}>
          <img src={logo.url} alt="" />
        </Link>
      </button>
    </div>
  );
};

export default Logo;
