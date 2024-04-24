import styles from "./CoverContainer.module.css";

const CoverContainer = ({ coverUrl, coverAltTxt }) => {
  return (
    <section className={styles.coverContainer} id="cover-container">
      <img src={coverUrl} alt={coverAltTxt} />
    </section>
  );
};

export default CoverContainer;
