import { useParams } from "next/navigation";
import React,{ useEffect} from "react";

const ShopIdGetGlobal = ({astrShopDetailData, setAstrShopDetailData}) => {
  const params = useParams();
console.log(params,astrShopDetailData);

  useEffect(() => {
    const fetchShopDetail = async () => {
      if (!params.slug) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-detail/${params.slug}`
        );
        console.log(res);

        const result = await res.json();
        setAstrShopDetailData(result.data); 
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    fetchShopDetail();
  }, [params?.slug]);
  return <div></div>;
};

export default ShopIdGetGlobal;
