"use client";
import { ModuleContext } from "../ModuleWrapper/ModuleWrapper";
import styles from "./ModuleColumn.module.css";

import { useRef, useContext, useEffect } from "react";

const ModuleColumn = ({ children }) => {
  const columnRef = useRef(null);

  const { addScrollableElem, sectionScrollDeltaY } = useContext(ModuleContext);

  useEffect(() => {
    const column = columnRef.current;
    addScrollableElem(column);
    column.scrollBy({ top: sectionScrollDeltaY, behavior: "instant" });
  }, [sectionScrollDeltaY, addScrollableElem]);

  return (
    <div className={styles.column} ref={columnRef}>
      {children}
    </div>
  );
};

export default ModuleColumn;
