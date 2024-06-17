import styles from "./Header.module.css";

import NavPages from "../NavPages/NavPages";
import NavSocials from "../NavSocials/NavSocials";

const Header = async ({ customStyle, pages, profile }) => {
  //   The styles defined by the user. Will be applied in the customStyle prop of the header tag
  const customStyles = {
    fontFamily: customStyle.headerFont
      .substring(0, customStyle.headerFont.indexOf("("))
      .trim(),
  };

  return (
    <header
      className={`${styles.header} container`}
      id="header"
      style={customStyles}
    >
      {/* The pages navigation displays the pages created by the user and the default ones */}
      <NavPages profile={profile} pages={pages} customStyle={customStyle} />
      {/* The 2nd navigation menu contains the social media and other websites links */}
      <NavSocials profile={profile} />
    </header>
  );
};

export default Header;
