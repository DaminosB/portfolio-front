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
const Logo = ({ profile, customStyle, pages }) => {
  // All props are given from the fetchData function

  const pathname = usePathname();
  const router = useRouter();

  const [isNavActive, setIsNavActive] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [showProjectsShortcut, setShowProjectsShortcut] = useState(false);

  const logoDivRef = useRef(null);

  // We store the headerHeight so the position is not untimely recalculed
  const headerHeight = useRef(0);

  const customStyles = {
    backgroundColor: customStyle.defaultBackgroundColor,
    color: customStyle.defaultFontColor,
  };

  // This is a value we will update to throttle iur ResizeObserver function
  let resizeTimeout;

  //   This func is called anytime the image changes dimensions
  const resizeObserver = new ResizeObserver((entries) => {
    // It's triggered at evry pixel change so we need to put this security

    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      const headerNode = entries[0].target;
      const isHeaderHidden = Array.from(headerNode.classList).includes(
        "hidden"
      );

      if (isHeaderHidden) setIsNavActive(true);
      else {
        setIsNavActive(false);
        setShowMenu(false);
      }
    }, 750);
  });

  // This useEffect gives the logo div its final top position and sets the Redirection URL
  useEffect(() => {
    const headerNode = document.getElementById("header");

    const clientWindowWidth = window.innerWidth;
    const element = logoDivRef.current;

    if (clientWindowWidth < 1024) {
      element.style.top = "10px";
      element.style.left = "10px";
      element.style.transform = "translateY(0px)";
    } else if (!headerHeight.current) {
      // The logo must be placed in the middle of the header
      headerHeight.current = headerNode.offsetHeight;
      const logoHeight = document.getElementById("logo").offsetHeight;
      element.style.top = `${headerHeight.current / 2}px`;
      element.style.transform = `translateY(-${logoHeight / 2}px)`;
    }

    if (pathname !== "/") setShowProjectsShortcut(true);
    else setShowProjectsShortcut(false);

    // We want to reset these 2 values at every pathname change
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
      router.replace("/?slider=projects&section=projects-container&delay=true");
    else router.push("/?slider=projects&section=projects-container&delay=true");
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
              <Link href="/?slider=projects&section=projects-container&delay=750">
                Retour aux créations
              </Link>
            )}
            <NavPages
              profile={profile}
              pages={pages}
              customStyle={customStyle}
            />
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
