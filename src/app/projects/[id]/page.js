import Logo from "@/components/Logo/Logo";
import styles from "./page.module.css";

import axios from "axios";

const fetchData = async (projectId) => {
  const response = await axios.get(
    // `${process.env.API_URL}/projects/${projectId}?populate[modules][populate]=*`,
    `${process.env.API_URL}/projects/${projectId}?populate=cover,modules`,
    { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
  );

  return response.data;
};

export default async function ProjectsIdPage({ params }) {
  const { data } = await fetchData(params.id);

  console.log(data);

  return <div>PAGE</div>;
}