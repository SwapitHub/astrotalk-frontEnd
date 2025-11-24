// AstroMallProductServer.jsx or .js

import React from "react";
import AstroMallProduct from "./AstroMallProduct";


export async function generateMetadata({ params }) {
  const { slug } = params;

  const data = await fetchShopDetail(slug);

  const meta = data?.data || {};

  return {
    title: meta.meta_title || "Default Title",
    description: meta.meta_description || "Default Description",
    keywords: meta.meta_keyword || meta.meta_title,
    openGraph: {
      title: meta.meta_title || "Default Title",
      description: meta.meta_description || "Default Description",
      url: process.env.NEXT_PUBLIC_WEBSITE_URL,
      siteName: meta.meta_site_name || "Default Site Name",
      images: [
        {
          url: meta.logo || "/astrotalk-logo.webp",
          width: 800,
          height: 600,
          alt: meta.logo_alt || "Default Image Alt",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.meta_title || "Default Title",
      description: meta.meta_description || "Default Description",
      images: [meta.logo || "/astrotalk-logo.webp"],
    },
  };
}

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
