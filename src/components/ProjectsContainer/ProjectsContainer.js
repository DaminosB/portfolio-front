import styles from "./ProjectsContainer.module.css";

const ProjectsContainer = ({ projects }) => {
  return (
    <div className={styles.projectsContainer}>
      <div className="container">
        {projects.map((project) => {
          return (
            <div key={project.id} className={styles.projectCard}>
              <img src={project.thumbnail.url} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsContainer;
