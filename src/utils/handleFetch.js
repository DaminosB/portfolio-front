const handleFetch = async (path) => {
  try {
    const response = await fetch(`${process.env.API_URL}/${path}`, {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
      cache: "no-store",
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

export default handleFetch;
