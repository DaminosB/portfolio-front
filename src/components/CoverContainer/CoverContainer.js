import styles from "./CoverContainer.module.css";

const CoverContainer = ({ profile }) => {
  return (
    <div className={styles.coverContainer} id="cover-container">
      <img src={profile.cover.url} alt={profile.cover.alternativeText} />
    </div>
  );
};

export default CoverContainer;
