import styles from "./CoverContainer.module.css";

const CoverContainer = ({ coverUrl, coverAltTxt, customColors }) => {
  const inlineStyle = {
    color: customColors.secondaryColor,
  };
  return (
    <section className={styles.coverContainer} id="cover-container">
      <img src={coverUrl} alt={coverAltTxt} />
      <div style={inlineStyle} className={styles.altCover}>
        <img src={coverUrl} alt={coverAltTxt} />
      </div>
    </section>
  );
};

export default CoverContainer;
