import axios from "axios";
import { useEffect, useState } from "react";

const useCustomGetApi = (fetchUrl) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGetData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${fetchUrl}`
      );
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      // toast.error("Failed to fetch data"); (optional)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetData();
  }, [fetchUrl]); // Make sure it runs again if URL changes

  return { data, loading };
};

export default useCustomGetApi;
