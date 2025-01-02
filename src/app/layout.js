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
import generateDynamicStyle from "@/utils/generateDynamicStyle";
config.autoAddCss = false; /* eslint-disable import/first */

export default async function RootLayout({ children }) {
  const { customStyle, profile, pages, googleFonts } = await fetchData();

  const bodyStyle = {
    backgroundImage: `url(${customStyle.homePageBackground.url})`,
    // fontFamily: customStyle.defaultFont
    //   .substring(0, customStyle.defaultFont.indexOf("("))
    //   .trim(),
    fontFamily: customStyle.font.fontName,
  };

  const customColors = {
    mainColor: customStyle.mainColor,
    secondaryColor: customStyle.secondaryColor,
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
        {googleFonts.map((font) => {
          return <link key={font.id} href={font.fontUrl} rel="stylesheet" />;
        })}
        <style>{generateDynamicStyle(customColors)}</style>
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

  let stylePath = "style?populate=";
  stylePath += "homePageBackground";
  stylePath += ",font";

  let profilePath = "profile?populate=";
  profilePath += "logo";
  profilePath += ",cover";
  profilePath += ",socialURLs";

  const pagesPath = "pages";

  const googleFontsPath = "google-fonts";

  const [
    customStyleResponse,
    profileResponse,
    pagesResponse,
    googleFontsResponse,
  ] = await Promise.all([
    handleFetch(stylePath),
    handleFetch(profilePath),
    handleFetch(pagesPath),
    handleFetch(googleFontsPath),
  ]);

  // Process and structure the responses into a unified object
  const response = {
    // Extract the customStyle data and nested homePageBackground attributes
    customStyle: {
      ...customStyleResponse.data.attributes,
      homePageBackground: {
        ...customStyleResponse.data.attributes.homePageBackground.data
          .attributes,
        id: customStyleResponse.data.attributes.homePageBackground.data.id,
      },
      font: {
        ...customStyleResponse.data.attributes.font.data.attributes,
        id: customStyleResponse.data.attributes.font.data.id,
      },
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
    googleFonts: googleFontsResponse.data.map((font) => ({
      ...font.attributes,
      id: font.id,
    })),
  };

  // Return the structured response object
  return response;
};
