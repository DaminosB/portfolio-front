import "./globals.css";

import axios from "axios";

import Logo from "@/components/Logo/Logo";
import Header from "@/components/Header/Header";

export async function generateMetadata({ params }) {
  try {
    const { data } = await axios.get(`${process.env.API_URL}/site-parameter`, {
      headers: { authorization: `Bearer ${process.env.API_TOKEN}` },
    });

    const { pageTitle, pageDescription } = data.data.attributes;
    return {
      title: pageTitle,
      description: pageDescription,
    };
  } catch (error) {
    console.log(error);
  }
}

const fetchData = async () => {
  try {
    const style = await axios.get(
      `${process.env.API_URL}/style?populate=homePageBackground`,
      {
        headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
      }
    );

    const profile = await axios.get(
      `${process.env.API_URL}/profile?populate=logo,cover`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    const response = {
      style: {
        ...style.data.data.attributes,
        homePageBackground:
          style.data.data.attributes.homePageBackground.data.attributes,
      },
      profile: {
        ...profile.data.data.attributes,
        logo: profile.data.data.attributes.logo.data.attributes,
        cover: profile.data.data.attributes.cover.data.attributes,
      },
    };

    return response;
  } catch (error) {
    console.log(error);
  }
};

export default async function RootLayout({ children }) {
  const { style, profile } = await fetchData();

  const customStyles = {
    backgroundImage: `url(${style.homePageBackground.url})`,
    fontFamily: style.defaultFont
      .substring(0, style.defaultFont.indexOf("("))
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
      <body className="viewport" style={customStyles}>
        <Header style={style} />
        <Logo logo={profile.logo} style={style} />
        {children}
      </body>
    </html>
  );
}
