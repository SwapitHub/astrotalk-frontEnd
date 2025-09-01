import axios from "axios";
import { useEffect, useState } from "react";

const useCustomGetApi = (fetchUrl) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const fetchGetData = async () => {
    try {
      if (!fetchUrl) return;
      setLoading(true);

      const fullUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${fetchUrl}`;

      const res = await axios.get(fullUrl);
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchUrl) {
      fetchGetData();
    }
  }, [fetchUrl]); 

  return { data, loading, setLoading, fetchGetData };
};

export default useCustomGetApi;
