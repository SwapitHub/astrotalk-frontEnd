// AstroMallProductServer.jsx or .js

import React from "react";
import AstroMallProduct from "./AstroMallProduct";


export async function generateMetadata({params}) {
  const {slug} = params
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-seo-meta-by-slug/${slug}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }

  const data = await res.json();

  return {
    title: data?.data?.meta_title || "Default Title",
    description: data?.data?.meta_description || "Default Description",
    keywords: data?.data?.meta_keyword || data?.data?.meta_title,

    openGraph: {
      title: data?.data?.meta_title || "Default Title",
      description: data?.data?.meta_description || "Default Description",
      url: process.env.NEXT_PUBLIC_WEBSITE_URL,
      siteName: data?.data?.meta_site_name || "Default Site Name",
      images: [
        {
          url:
            data?.data?.logo ||
            "/astrotalk-logo.webp",
          width: 800,
          height: 600,
          alt: data?.data?.logo_alt || "Default Image Alt",
        },
      ],
      locale: "en_US",
      type: "website",
    },

    // Optional: Twitter metadata
    twitter: {
      card: "summary_large_image",
      title: data?.data?.meta_title || "Default Title",
      description: data?.data?.meta_description || "Default Description",
      images: [
        data?.data?.logo ||
          "/astrotalk-logo.webp",
      ],
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
