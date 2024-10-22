"use client";
import styles from "./VideoPlayer.module.css";

import { useState, useRef, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const VideoPlayer = ({ children, video, shouldPlayVideo, customColors }) => {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const videoPlayerRef = useRef(null);

  const buttonInlineStyle = {
    color: isHovered ? customColors.mainColor : customColors.secondaryColor,
  };

  const enableVideoPlayer = (e) => {
    e.stopPropagation();
    setIsActive(true);
    videoPlayerRef.current.play();
  };

  const closePlayer = () => {
    setIsActive(false);
    const videoPlayer = videoPlayerRef.current;

    videoPlayer.pause();
    videoPlayer.currentTime = 0;
  };

  useEffect(() => {
    if (!shouldPlayVideo && isActive) closePlayer();
  }, [shouldPlayVideo, isActive]);

  const toggleIsHovered = () => setIsHovered((prev) => !prev);

  return (
    <div
      className={styles.videoWrapper}
      onMouseEnter={toggleIsHovered}
      onMouseLeave={toggleIsHovered}
    >
      <div>
        <button style={buttonInlineStyle} onClick={enableVideoPlayer}>
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <img src={video.caption} alt="" />
      </div>
      <video
        ref={videoPlayerRef}
        className={`${styles.videoPlayer} ${isActive ? "" : "hidden"}`}
        controls
        controlsList="nofullscreen"
        preload="metadata"
        onEnded={closePlayer}
      >
        {children}
      </video>
    </div>
  );
};

export default VideoPlayer;
