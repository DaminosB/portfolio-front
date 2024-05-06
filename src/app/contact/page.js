// Packages imports
import axios from "axios";

// React components imports
import { Suspense } from "react";

// Components import
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import ContactForm from "@/components/ContactForm/ContactForm";

const fetchData = async () => {
  try {
    // First we make the needed requests
    const profile = await axios.get(`${process.env.API_URL}/profile`, {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
    });

    const style = await axios.get(`${process.env.API_URL}/style`, {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
    });

    // Then we prepare the object that will contain the needed informations
    const responses = {
      profile: { ...profile.data.data.attributes },
      style: { ...style.data.data.attributes },
    };

    return responses;
  } catch (error) {
    console.log(error);
  }
};

export default async function Home() {
  const { profile, style } = await fetchData();

  console.log("profile", profile);
  console.log("style", style);

  return (
    <Suspense>
      <ContentWrapper>
        <ContactForm profile={profile} style={style} />
      </ContentWrapper>
    </Suspense>
  );
}
