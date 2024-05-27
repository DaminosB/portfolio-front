import styles from "./ProjectCard.module.css";

import Link from "next/link";

const ProjectCard = ({ cardData }) => {
  const { id, thumbnail, customStyles, link } = cardData;

  return (
    <div
      className={styles.projectCard}
      style={customStyles}
      id={`project-card-${id}`}
    >
      <Link href={link}>
        <img src={thumbnail.url} alt={thumbnail.alternativeText} />
      </Link>
    </div>
  );
};

export default ProjectCard;
