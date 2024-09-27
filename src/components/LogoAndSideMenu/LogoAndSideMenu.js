"use client";

import styles from "./LogoAndSideMenu.module.css";

// React hooks imports
import { useEffect, useState, useRef, useContext } from "react";
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import NavSocials from "../NavSocials/NavSocials";
import ContactForm from "../ContactForm/ContactForm";

// This component displays a logo that sends the visitor back to the homepage's cover
const LogoAndSideMenu = ({ profile, customStyle, pages }) => {
  // All props are given from the fetchData function

  // The component will be moved to the <body> element, so we store the portal destination in a state
  const [targetDom, setTargetDom] = useState(null);

  // This state indicates if the side panel must be shown or not
  const [showSidePanel, setShowSidePanel] = useState(false);

  // We check if we are on the homePage, if not we show the go to projects shortcut
  const pathname = usePathname();
  const isOnHomepage = pathname === "/";

  const cachedPathname = useRef(null);

  const { isModaleDisplayed, openModale, linkTo } = useContext(LayoutContext);

  // This object will be transmitted to the dom in order to display custom colors
  const inlineStyle = {
    backgroundColor: customStyle.mainColor,
    color: customStyle.secondaryColor,
  };

  // This useEffect gives the logo div its final top position
  useEffect(() => {
    // If targetDom is not defined we must define it
    if (!targetDom) {
      setTargetDom(document.body);
    }

    if (pathname !== cachedPathname.current) {
      setShowSidePanel(false);
      cachedPathname.current = pathname;
    } else if (isModaleDisplayed) {
      setShowSidePanel(false);
    }
  }, [pathname, targetDom, isModaleDisplayed]);

  const toggleMenu = () => {
    setShowSidePanel((prev) => !prev);
  };

  const openContactForm = () => {
    const { mainColor, secondaryColor } = customStyle;
    openModale(
      { mainColor, secondaryColor },
      <ContactForm customStyle={customStyle} />
    );
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
          <button
            style={inlineStyle}
            className={styles.crossButton}
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <nav>
            {!isOnHomepage && (
              <button onClick={() => linkTo("/")}>Accueil</button>
            )}
            {/* The pages created by the user are displayed through a .map function */}
            {pages.map((page) => {
              const handleOnClick = () => {
                const link = `/user-pages/${page.id}`;
                linkTo(link);
              };
              return (
                <button key={page.id} onClick={handleOnClick}>
                  {page.name}
                </button>
              );
            })}
            <button onClick={openContactForm}>Contact</button>
          </nav>
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

export default LogoAndSideMenu;
