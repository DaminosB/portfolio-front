"use client";
import styles from "./ModuleWrapper.module.css";

// React hooks and context
import {
  useState,
  useContext,
  useEffect,
  useRef,
  createContext,
  useMemo,
  useCallback,
} from "react";
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

// Components
import Carousel from "@/components/Carousel/Carousel";
import NavigationButton from "@/components/NavigationButton/NavigationButton";
import ScrollBar from "@/components/ScrollBar/ScrollBar";
import useScrollTracker from "@/hooks/useScrollTracker";

// Utils import
import populateScrollbarMetrics from "@/utils/populateScrollBarMetrics";

// Icons import
import { faCircle } from "@fortawesome/free-solid-svg-icons";

// Create a context to share state and actions with child components
export const ModuleContext = createContext();

const ModuleWrapper = ({
  inlineStyle,
  customColors,
  module,
  sectionCoords: [containerIndex, sectionIndex],
  children,
}) => {
  // -------------------------------------------------------------------------
  // States and Refs
  // -------------------------------------------------------------------------
  // const [isActiveSection, setIsActiveSection] = useState(false); // Tracks if the module is active

  const [xScrollRatio, setXScrollRatio] = useState(0); // Tracks horizontal scroll ratio
  const [scrollBarMetrics, setScrollBarMetrics] = useState({
    thumbHeight: 0,
    scrollProgress: 0,
  }); // Scrollbar metrics: thumb height and scroll progress

  const sectionRef = useRef(null); // Reference to the main section DOM element
  const ghostRef = useRef(null); // Reference to the "ghost" element
  const scrollableElemsRef = useRef([]); // Stores scrollable child elements
  const cachedYScrollPosition = useRef(0); // Stores the last Y scroll position

  const {
    activeCoords: [activeContainerIndex, activeChildIndex],
    showModale,
    setModaleContent,
  } = useContext(LayoutContext);

  const isActiveSection = useMemo(
    () =>
      activeContainerIndex === containerIndex &&
      activeChildIndex === sectionIndex,
    [containerIndex, sectionIndex, activeContainerIndex, activeChildIndex]
  );

  // -------------------------------------------------------------------------
  // Scroll Management (X and Y axes)
  // -------------------------------------------------------------------------

  // A ghost element serves as a placeholder to simulate scrolling.
  // It dynamically adjusts its width and height to match the total overflow content
  // (horizontal for media galleries and vertical for overflowing module content).
  // This allows the scroller to have the proper scroll dimensions without requiring
  // the actual {children} elements to move, as they remain sticky at top: 0 and left: 0.

  // Handles vertical scrolling for overflowing content
  const { scrollPosition: yScrollPosition, scrollTrack: yScrollTrack } =
    useScrollTracker();

  // Handles horizontal scrolling for media galleries
  const {
    scrollPosition: xScrollPosition,
    scrollTrack: xScrollTrack,
    displayIndex: galleryIndex,
  } = useScrollTracker(true);

  // Unified scroll handler for both axes
  const handleOnScroll = (e) => {
    const lastChildIndex = e.target.children.length - 1;
    xScrollTrack(e, [lastChildIndex]); // Track horizontal scroll

    yScrollTrack(e); // Track vertical scroll
  };

  // -------------------------------------------------------------------------
  // Functions: Media handling and scrolling actions
  // -------------------------------------------------------------------------

  // Filter and deduplicate media assets to display in the carousel
  const mediasToDisplay = useMemo(
    () =>
      module.mediaBlocks ? populateMediasToDisplay(module.mediaBlocks) : null,
    [module.mediaBlocks]
  );

  // Opens a carousel modal at the selected media
  const openCarousel = (mediaId) => {
    const mediaIndex = mediasToDisplay.findIndex(
      (media) => media.id === mediaId
    );
    setModaleContent(
      <Carousel
        mediasToDisplay={mediasToDisplay}
        mediaBlocks={module.mediaBlocks}
        indexStart={mediaIndex}
        customColors={customColors}
      />
    );
  };

  // Allows child components to register as scrollable elements
  const addScrollableElem = useCallback((element) => {
    if (!scrollableElemsRef.current.includes(element)) {
      scrollableElemsRef.current.push(element);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Effects: Activity monitoring and layout updates
  // -------------------------------------------------------------------------
  useEffect(() => {
    const section = sectionRef.current;

    // Update the ghost element's height based on the largest overflow
    const ghost = ghostRef.current;
    const ghostHeight = scrollableElemsRef.current.reduce(
      (maxOverflow, elem) => {
        const overflowY = elem.scrollHeight - elem.offsetHeight;
        return Math.max(maxOverflow, overflowY);
      },
      0
    );

    ghost.style.height = `${ghostHeight}px`;

    // Calculate and update scrollbar metrics
    const scroller = section.firstElementChild;
    setScrollBarMetrics(() => populateScrollbarMetrics(scroller));

    // Cache the latest Y scroll position
    cachedYScrollPosition.current = yScrollPosition;

    // Update X scroll ratio
    const newXScrollRatio = xScrollPosition / scroller.clientWidth || 0;
    if (newXScrollRatio !== xScrollRatio) {
      setXScrollRatio(newXScrollRatio);
    }
  }, [yScrollPosition, xScrollPosition, xScrollRatio]);

  const maxGalleryLength = module.mediaBlocks.reduce(
    (maxCount, block) => Math.max(maxCount, block.mediaAssets.length),
    0
  );

  const contextValues = {
    isActiveSection,
    openCarousel,
    showModale,
    addScrollableElem,
    sectionScrollDeltaY: yScrollPosition - cachedYScrollPosition.current,
    sectionXScrollRatio: xScrollRatio,
  };

  const galleryIndicatorInlineStyle = {
    backgroundColor: customColors.mainColor,
    color: customColors.secondaryColor,
  };

  const ghostInlineStyle = {
    width: `${maxGalleryLength * 100}%`,
  };

  return (
    <ModuleContext.Provider value={contextValues}>
      <section
        className={styles.moduleWrapper}
        style={inlineStyle}
        ref={sectionRef}
      >
        <div
          data-role="scroller"
          className={styles.scroller}
          onScroll={handleOnScroll}
        >
          {children}

          {/* --------------------------------------------------- */}
          {/* ---------------------- GHOST ---------------------- */}
          {/* --------------------------------------------------- */}

          <div
            data-role="ghost"
            className={styles.ghost}
            style={ghostInlineStyle}
            ref={ghostRef}
          >
            {Array.from({ length: maxGalleryLength }).map((_, index) => (
              <div key={index}></div>
            ))}
          </div>
        </div>

        {/* --------------------------------------------------- */}
        {/* ------------ GALLERY NAVIGATION BUTTONS ----------- */}
        {/* --------------------------------------------------- */}
        {maxGalleryLength > 1 && (
          <div className={styles.navContainer}>
            <nav style={galleryIndicatorInlineStyle}>
              {Array.from({ length: maxGalleryLength }).map((_, index) => {
                const handleOnClick = () => {
                  const scroller = sectionRef.current.firstElementChild;
                  const ghost = ghostRef.current;
                  const scrollTarget = ghost.children[index].offsetLeft;
                  scroller.scrollTo({ left: scrollTarget, behavior: "smooth" });
                };
                return (
                  <NavigationButton
                    key={index}
                    icon={faCircle}
                    isActive={index === galleryIndex}
                    onClickFunction={handleOnClick}
                  />
                );
              })}
            </nav>
          </div>
        )}

        {/* --------------------------------------------------- */}
        {/* -------------------- SCROLLBAR -------------------- */}
        {/* --------------------------------------------------- */}
        <ScrollBar customColors={customColors} metrics={scrollBarMetrics} />
      </section>
    </ModuleContext.Provider>
  );
};

export default ModuleWrapper;

/* Utility to populate media assets for the carousel */
const populateMediasToDisplay = (mediaBlocks) =>
  mediaBlocks
    .flatMap((block) =>
      block.mediaAssets.filter((asset) => asset.addToCarousel)
    )
    .filter(
      (asset, index, array) =>
        index === array.findIndex((subItem) => subItem.id === asset.id)
    );
