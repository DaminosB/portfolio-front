import styles from "./CoverContainer.module.css";

const CoverContainer = ({ profile }) => {
  return (
    <section className={styles.coverContainer} id="cover-container">
      <img src={profile.cover.url} alt={profile.cover.alternativeText} />
    </section>
  );
};

export default CoverContainer;
