import "./globals.css";

// import axios from "axios";

import LogoAndSideMenu from "@/components/LogoAndSideMenu/LogoAndSideMenu";
import LayoutWrapper from "@/wrappers/LayoutWrapper/LayoutWrapper";

import handleFetch from "@/utils/handleFetch";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

export default async function RootLayout({ children }) {
  const { customStyle, profile, pages } = await fetchData();

  const bodyStyle = {
    backgroundImage: `url(${customStyle.homePageBackground.url})`,
    fontFamily: customStyle.defaultFont
      .substring(0, customStyle.defaultFont.indexOf("("))
      .trim(),
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Caveat:wght@400..700&family=Dancing+Script:wght@400..700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Pacifico&family=Permanent+Marker&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Saira+Condensed:wght@100;200;300;400;500;600;700;800;900&family=Satisfy&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="viewport" style={bodyStyle}>
        <main>
          <LayoutWrapper>
            <LogoAndSideMenu
              profile={profile}
              customStyle={customStyle}
              pages={pages}
            />
            {children}
          </LayoutWrapper>
        </main>
      </body>
    </html>
  );
}

export async function generateMetadata() {
  const { data } = await handleFetch("site-parameter");
  return {
    title: data.attributes.pageTitle,
    description: data.attributes.pageDescription,
  };
}

const fetchData = async () => {
  // Execute all API requests in parallel using Promise.all() to fetch data for custom styles, profile, and pages
  const [customStyleResponse, profileResponse, pagesResponse] =
    await Promise.all([
      handleFetch("style?populate=homePageBackground"),
      handleFetch("profile?populate=logo,cover,socialURLs"),
      handleFetch("pages"),
    ]);

  // Process and structure the responses into a unified object
  const response = {
    // Extract the customStyle data and nested homePageBackground attributes
    customStyle: {
      ...customStyleResponse.data.attributes,
      homePageBackground:
        customStyleResponse.data.attributes.homePageBackground.data.attributes,
    },
    // Extract the profile data, including logo and cover attributes
    profile: {
      ...profileResponse.data.attributes,
      logo: profileResponse.data.attributes.logo.data.attributes,
      cover: profileResponse.data.attributes.cover.data.attributes,
      socialURLs: profileResponse.data.attributes.socialURLs,
    },
    // Process each page object, extracting its attributes and adding the id
    pages: pagesResponse.data.map((page) => ({
      ...page.attributes,
      id: page.id,
    })),
  };

  // Return the structured response object
  return response;
};
