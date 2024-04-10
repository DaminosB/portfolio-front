import styles from "./page.module.css";

import axios from "axios";

const fetchData = async () => {
  const response = await axios.get(
    `${process.env.API_URL}/profile?populate=cover`,
    { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
  );
  return response.data;
};

export default async function Home() {
  const { data } = await fetchData();

  const bannerUrl = data.attributes.cover.data.attributes.url;
  return (
    <main className={styles.homePage}>
      <div>
        <img src={bannerUrl} alt="" />
      </div>
      <div></div>
    </main>
  );
}
