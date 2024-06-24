// No style so it can be set directly in the parnet component

// Font Awesome components and icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const NavSocials = ({ profile }) => {
  //   This array will be displayed in a .map function
  const socialsArray = Object.entries(profile.socialURLs)
    .filter(
      // We don't want to keep the "id" key and the otherURLs key which is a nested object
      (social) => social[0] !== "id" && social[0] !== "otherURLs" && social[1]
    )
    .map((social) => {
      return { name: social[0], url: social[1] };
    });

  // This array will be displayed in another .map function
  const otherURLsArray = profile.otherURLs.map((entry) => {
    return {
      name: entry.name,
      url: entry.url,
      iconURL: entry.logo.data.attributes.url,
    };
  });

  const getSocialIconAndTitle = (name) => {
    switch (name) {
      case "facebook":
        return { icon: faFacebookF, title: "Facebook" };
      case "twitter":
        return { icon: faXTwitter, title: "X/Twitter" };
      case "instagram":
        return { icon: faInstagram, title: "Instagram" };
      case "linkedin":
        return { icon: faLinkedinIn, title: "LinkedIn" };
      default:
        break;
    }
  };

  return (
    <nav>
      {/* We 1st display the default social media */}
      {socialsArray.map((social, index) => {
        // We call the getSocialIconAndTitle function to define which icon and title to display
        const { icon, title } = getSocialIconAndTitle(social.name);
        return (
          <a key={social.url} href={social.url} title={title} target="_blank">
            <FontAwesomeIcon icon={icon} />
          </a>
        );
      })}

      {/* Then the otherURLs the user may have entered */}
      {/* {otherURLsArray.map((link, index) => {
        return (
          <a key={link.name} href={link.url} title={link.name} target="_blank">
            <img src={link.iconURL} alt={`logo du site ${link.name}`} />
          </a>
        );
      })} */}
    </nav>
  );
};

export default NavSocials;
