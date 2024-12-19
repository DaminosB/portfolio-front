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
import Link from "next/link";
import Image from "next/image";

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
  const crossButtonRef = useRef(null);
  const logoButtonRef = useRef(null);

  const { showModale, setModaleContent } = useContext(LayoutContext);

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
    } else {
      const crossButton = crossButtonRef.current;
      const logoButton = logoButtonRef.current;

      crossButton.classList.remove("hidden");
      logoButton.classList.remove("hidden");
    }

    if (pathname !== cachedPathname.current) {
      setShowSidePanel(false);
      cachedPathname.current = pathname;
    } else if (showModale) {
      setShowSidePanel(false);
    }
  }, [pathname, targetDom, showModale]);

  const toggleMenu = () => {
    setShowSidePanel((prev) => !prev);
  };

  const openContactForm = () => {
    setModaleContent(<ContactForm customStyle={customStyle} />);
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
            className={`hidden ${styles.crossButton}`}
            ref={crossButtonRef}
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <nav>
            {!isOnHomepage && <Link href={"/"}>Accueil</Link>}
            {/* The pages created by the user are displayed through a .map function */}
            {pages.map((page) => {
              return (
                <Link key={page.id} href={`/user-pages/${page.id}`}>
                  {page.title}
                </Link>
              );
            })}
            <button onClick={openContactForm}>Contact</button>
          </nav>
          <NavSocials profile={profile} />
        </div>

        <button
          className={`hidden ${styles.logoButton}`}
          onClick={toggleMenu}
          ref={logoButtonRef}
        >
          <Image
            width={profile.logo.width}
            height={profile.logo.height}
            src={profile.logo.url}
            alt={profile.logo.alternativeText}
            draggable={false}
            priority={true}
          />
        </button>
      </>,
      targetDom
    )
  );
};

export default LogoAndSideMenu;
