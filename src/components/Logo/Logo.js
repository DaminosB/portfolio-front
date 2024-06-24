"use client";

import styles from "./Logo.module.css";

// React hooks imports
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavPages from "../NavPages/NavPages";
import NavSocials from "../NavSocials/NavSocials";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// This component displays a logo that sends the visitor back to the homepage's cover
const Logo = ({ profile, customStyle, pages }) => {
  // All props are given from the fetchData function

  // The component will be moved to the <body> element, so we store the portal destination in a state
  const [targetDom, setTargetDom] = useState(null);

  // This state indicates if the side panel must be shown or not
  const [showSidePanel, setShowSidePanel] = useState(false);

  // We check if we are on the homePage, if not we show the go to projects shortcut
  const pathname = usePathname();
  const isOnHomepage = pathname === "/";

  // This object will be transmitted to the dom in order to display custom colors
  const inlineStyle = {
    backgroundColor: customStyle.mainColor,
    color: customStyle.secondaryColor,
  };

  // This useEffect gives the logo div its final top position
  useEffect(() => {
    // This the logo's DOM element
    const logoButton = document.getElementById("logo-button");

    // The logo must be aligned with the header, so we check fo its height
    const headerHeight = document.getElementById("header").scrollHeight;

    // If targetDom is not defined we must define it
    if (!targetDom) {
      setTargetDom(document.body);
    } else if (headerHeight > 0) {
      // Otherwise we give the logo button its final position (only if the header is displayed)
      logoButton.style.top = `${headerHeight / 2}px`;
    }
  }, [pathname, targetDom]);

  const toggleMenu = () => {
    setShowSidePanel((prev) => !prev);
  };

  return (
    targetDom &&
    createPortal(
      <>
        <div
          style={inlineStyle}
          className={`${styles.sidePanel} ${
            showSidePanel ? styles.open : styles.closed
          }`}
        >
          <button style={inlineStyle} onClick={toggleMenu}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          {!isOnHomepage && (
            <Link href="/?slider=projects&section=projects-container&delay=750">
              Retour aux projets
            </Link>
          )}
          <NavPages profile={profile} pages={pages} customStyle={customStyle} />
          <NavSocials profile={profile} />
        </div>

        <button
          className={styles.logoButton}
          onClick={toggleMenu}
          id="logo-button"
        >
          <img src={profile.logo.url} alt={profile.logo.alternativeText} />
        </button>
      </>,
      targetDom
    )
  );
};

export default Logo;
