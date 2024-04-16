import styles from "./Logo.module.css";

// This component displays a logo that sends the visitor back to the homepage's cover
const Logo = ({ logo, style, activeIndex, setActiveIndex }) => {
  // logo: Object. The logo's infos to display it. Got through a request to the back
  // style: Object. The style infos to display it. Got through a request to the back
  // activeIndex: Number. The index of the child we want to display
  // setActiveIndex: Func. Updates activeIndex's state

  // We set an objet to give to the style prop on the container
  const containerStyles = {
    top: style.headerHeight / 2,
  };

  // The span needs its own style
  const customStyles = {
    backgroundColor: style.defaultBackgroundColor,
    color: style.defaultFontColor,
  };

  return (
    <div className={styles.logo} style={containerStyles}>
      {/* On click, we are sent back to the cover */}
      <button onClick={() => setActiveIndex(0)}>
        <img src={logo.url} alt="" />
        {/* When not on the cover, we display a text when the button is hovered */}
        {activeIndex > 0 && <span style={customStyles}>Menu</span>}
      </button>
    </div>
  );
};

export default Logo;
