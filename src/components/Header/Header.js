// import styles from "./Header.module.css";
// import axios from "axios";

// // Next components
// import Link from "next/link";

// // Font Awesome components and icons
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFacebookF,
//   faInstagram,
//   faLinkedinIn,
//   faXTwitter,
// } from "@fortawesome/free-brands-svg-icons";

// const fetchData = async () => {
//   // First we call the API to get the data we will need
//   const pages = await axios.get(`${process.env.API_URL}/pages`, {
//     headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
//   });

//   const profile = await axios.get(
//     `${process.env.API_URL}/profile?populate=logo,socialURLs.otherURLs.logo`,
//     {
//       headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
//     }
//   );

//   //   Then we prepare the object that will store our needed data
//   const responses = {
//     profile: {
//       ...profile.data.data.attributes,
//       logo: profile.data.data.attributes.logo.data.attributes,
//       socialURLs: profile.data.data.attributes.socialURLs,
//       otherURLs: profile.data.data.attributes.socialURLs.otherURLs,
//       defaultFont: profile.data.data.attributes.defaultFont,
//     },
//     pages: pages.data.data,
//   };

//   //   Finaly, we clean up the pages key
//   responses.pages.forEach((page, index) => {
//     responses.pages[index] = { ...page.attributes, id: page.id };
//   });

//   return responses;
// };

// const Header = async ({ style }) => {
//   // We call the fetchData function
//   const { pages, profile } = await fetchData();

//   //   This array will be displayed in a .map fucntion
//   const socialsArray = Object.entries(profile.socialURLs)
//     .filter(
//       // We don't want to keep the "id" key and the otherURLs key which is a nested object
//       (social) => social[0] !== "id" && social[0] !== "otherURLs" && social[1]
//     )
//     .map((social) => {
//       return { name: social[0], url: social[1] };
//     });

//   // This array will be displayed in another .map function
//   const otherURLsArray = profile.otherURLs.map((entry) => {
//     return {
//       name: entry.name,
//       url: entry.url,
//       iconURL: entry.logo.data.attributes.url,
//     };
//   });

//   //   The styles defined by the user. Will be applied in the style prop of the header tag
//   const customStyles = {
//     fontFamily: style.headerFont
//       .substring(0, style.headerFont.indexOf("("))
//       .trim(),
//   };

//   const getSocialIconAndTitle = (name) => {
//     switch (name) {
//       case "facebook":
//         return { icon: faFacebookF, title: "Facebook" };
//       case "twitter":
//         return { icon: faXTwitter, title: "X/Twitter" };
//       case "instagram":
//         return { icon: faInstagram, title: "Instagram" };
//       case "linkedin":
//         return { icon: faLinkedinIn, title: "LinkedIn" };
//       default:
//         break;
//     }
//   };

//   return (
//     <header className={`${styles.header} container`} style={customStyles}>
//       {/* The first div contains the website logo and the pages navigation */}
//       <div>
//         {/* Logo */}
//         <img
//           className={styles.logo}
//           src={profile.logo.url}
//           alt={profile.logo.alternativeText}
//         />

//         {/* The pages navigation displays the pages created by the user and the default ones */}
//         <nav>
//           {/* The Home page is created by default */}
//           <Link href="/">Accueil</Link>

//           {/* The pages created by the user are displayed through a .map function */}
//           {pages.map((page, index) => {
//             return (
//               <Link key={page.id} href={`/user-pages/${page.id}`}>
//                 {page.name}
//               </Link>
//             );
//           })}

//           {/* The Contact page is created by default */}
//           <Link href="/contact">Contact</Link>
//         </nav>
//       </div>

//       {/* The 2nd navigation menu contains the social media and other websites links */}
//       <nav>
//         {/* We 1st display the default social media */}
//         {socialsArray.map((social, index) => {
//           // We call the getSocialIconAndTitle function to define which icon and title to display
//           const { icon, title } = getSocialIconAndTitle(social.name);
//           return (
//             <a key={social.url} href={social.url} title={title} target="_blank">
//               <FontAwesomeIcon icon={icon} />
//             </a>
//           );
//         })}

//         {/* Then the otherURLs the user may have entered */}
//         {otherURLsArray.map((link, index) => {
//           return (
//             <a
//               key={link.name}
//               href={link.url}
//               title={link.name}
//               target="_blank"
//             >
//               <img src={link.iconURL} alt={`logo du site ${link.name}`} />
//             </a>
//           );
//         })}
//       </nav>
//     </header>
//   );
// };

// export default Header;

import styles from "./Header.module.css";
import axios from "axios";

// Next components
import Link from "next/link";

// Font Awesome components and icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const fetchData = async () => {
  // First we call the API to get the data we will need
  const pages = await axios.get(`${process.env.API_URL}/pages`, {
    headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
  });

  const profile = await axios.get(
    `${process.env.API_URL}/profile?populate=socialURLs.otherURLs.logo`,
    {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
    }
  );

  //   Then we prepare the object that will store our needed data
  const responses = {
    profile: {
      ...profile.data.data.attributes,
      socialURLs: profile.data.data.attributes.socialURLs,
      otherURLs: profile.data.data.attributes.socialURLs.otherURLs,
      defaultFont: profile.data.data.attributes.defaultFont,
    },
    pages: pages.data.data,
  };

  //   Finaly, we clean up the pages key
  responses.pages.forEach((page, index) => {
    responses.pages[index] = { ...page.attributes, id: page.id };
  });

  return responses;
};

const Header = async ({ style }) => {
  // We call the fetchData function
  const { pages, profile } = await fetchData();

  //   This array will be displayed in a .map fucntion
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

  //   The styles defined by the user. Will be applied in the style prop of the header tag
  const customStyles = {
    fontFamily: style.headerFont
      .substring(0, style.headerFont.indexOf("("))
      .trim(),
  };

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
    <header className={`${styles.header} container`} style={customStyles}>
      {/* The pages navigation displays the pages created by the user and the default ones */}
      <nav>
        {/* The pages created by the user are displayed through a .map function */}
        {pages.map((page, index) => {
          return (
            <Link key={page.id} href={`/user-pages/${page.id}`}>
              {page.name}
            </Link>
          );
        })}

        {/* The Contact page is created by default */}
        <Link href="/contact">Contact</Link>
      </nav>

      {/* The 2nd navigation menu contains the social media and other websites links */}
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
        {otherURLsArray.map((link, index) => {
          return (
            <a
              key={link.name}
              href={link.url}
              title={link.name}
              target="_blank"
            >
              <img src={link.iconURL} alt={`logo du site ${link.name}`} />
            </a>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
