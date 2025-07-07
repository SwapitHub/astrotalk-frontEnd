import React from 'react'
import AstroMallProduct from './AstromallProduct'

const astrShopDetail = async (slug) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-detail/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch shop data");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching shop data:", error);
    return null;
  }
};

const AstroMallProductServer = async ({params}) => {
  const slug = params.slug;
  
  // 2. Await the data
  const astrShopDetailData = await astrShopDetail(slug[0]);
  
  
  return (
    <>
    <AstroMallProduct astrShopDetailData={astrShopDetailData}/>
    </>
  )
}

export default AstroMallProductServer