// AstroMallProductServer.jsx or .js

import React from "react";
import AstroMallProduct from "./AstroMallProduct";

const fetchShopDetail = async (slug) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-detail/${slug}`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch astrologer data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching astrologer data:', error);
    return null;
  }
};

const AstroMallProductServer = async ({ params }) => {
  const { slug } = params;
  const astrShopDetailData = await fetchShopDetail(slug);

  return (
    <div>
      <AstroMallProduct astrShopDetailData={astrShopDetailData.data} />
    </div>
  );
};

export default AstroMallProductServer;
