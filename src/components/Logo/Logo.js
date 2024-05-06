"use client";

import styles from "./Logo.module.css";

// React hooks imports
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
// ResizeObserver API. Will be used tto check if the image is wider than its parent
import ResizeObserver from "resize-observer-polyfill";
import NavPages from "../NavPages/NavPages";
import NavSocials from "../NavSocials/NavSocials";

// This component displays a logo that sends the visitor back to the homepage's cover
const Logo = ({ profile, style, pages }) => {
  // logo: Object. The logo's infos to display it. Got through a request to the back

  const pathname = usePathname();
  const router = useRouter();

  const [isNavActive, setIsNavActive] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [showProjectsShortcut, setShowProjectsShortcut] = useState(false);

  const logoDivRef = useRef(null);

  // We store the headerHeight so the position is not untimely recalculed
  const headerHeight = useRef(0);

  const customStyles = {
    backgroundColor: style.defaultBackgroundColor,
    color: style.defaultFontColor,
  };

  // At first, debounce is true, it will then be on false so the function won't be triggered
  const heightChangeDebounce = useRef(true);

  //   This func is called anytime the image changes dimensions
  const resizeObserver = new ResizeObserver((entries) => {
    // It's triggered at evry pixel change so we need to put this security

    if (heightChangeDebounce.current) {
      heightChangeDebounce.current = false;
      const headerNode = entries[0].target;
      const isHeaderHidden = Array.from(headerNode.classList).includes(
        "hidden"
      );

      if (isHeaderHidden) setIsNavActive(true);
      else {
        setIsNavActive(false);
        setShowMenu(false);
      }

      setTimeout(() => {
        heightChangeDebounce.current = true;
      }, 1000);
    }
  });

  // This useEffect gives the logo div its final top position and sets the Redirection URL
  useEffect(() => {
    const headerNode = document.getElementById("header");
    if (!headerHeight.current) {
      const element = logoDivRef.current;

      // The logo must be placed in the middle of the header
      headerHeight.current = headerNode.offsetHeight;
      const logoHeight = document.getElementById("logo").offsetHeight;
      element.style.top = `${headerHeight.current / 2}px`;
      element.style.transform = `translateY(-${logoHeight / 2}px)`;
    }

    if (pathname !== "/") setShowProjectsShortcut(true);
    else setShowProjectsShortcut(false);

    setIsNavActive(false);
    setShowMenu(false);

    resizeObserver.observe(headerNode);

    return () => {
      resizeObserver.unobserve(headerNode);
    };
  }, [pathname]);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };
  const goToProjects = () => {
    if (pathname === "/")
      router.replace("/?section=projects-container&delay=true");
    else router.push("/?section=projects-container&delay=true");
  };

  return (
    <div
      className={`${styles.logo} ${
        isNavActive ? styles.flexStart : styles.centered
      }`}
      ref={logoDivRef}
    >
      <button onClick={isNavActive ? toggleMenu : goToProjects}>
        <img
          src={profile.logo.url}
          alt={profile.logo.alternativeText}
          id="logo"
        />
      </button>
      {isNavActive ? (
        <div
          className={`${styles.navContainer} ${!showMenu ? "zero-width" : ""}`}
        >
          <div>
            {showProjectsShortcut && (
              <Link href="/?section=projects-container&delay=true">
                Retour aux créations
              </Link>
            )}
            <NavPages profile={profile} pages={pages} style={style} />
            <NavSocials profile={profile} />
          </div>
        </div>
      ) : (
        <span style={customStyles}>Créations</span>
      )}
    </div>
  );
};

export default Logo;
