import React from 'react'
import FillIntake from './FillIntake'


const fetchShopDetail = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-product-detail/${id}`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch astrologer data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching astrologer data:", error);
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { id } = params;
  const astrShopDetailData = await fetchShopDetail(id);
  if (!astrShopDetailData) return;
  return {
    title: astrShopDetailData?.data?.meta_title || "Default Title",
    description:
      astrShopDetailData?.data?.meta_description || "Default Description",
    keywords:
      astrShopDetailData?.data?.meta_keyword ||
      astrShopDetailData?.data?.meta_title,

    openGraph: {
      title: astrShopDetailData?.data?.meta_title || "Default Title",
      description:
        astrShopDetailData?.data?.meta_description || "Default Description",
      url: process.env.NEXT_PUBLIC_WEBSITE_URL,
      siteName: astrShopDetailData?.data?.meta_site_name || "Default Site Name",
      images: [
        {
          url: astrShopDetailData?.data?.logo || "/astrotalk-logo.webp",
          width: 800,
          height: 600,
          alt: astrShopDetailData?.data?.logo_alt || "Default Image Alt",
        },
      ],
      locale: "en_US",
      type: "website",
    },

    // Optional: Twitter metadata
    twitter: {
      card: "summary_large_image",
      title: astrShopDetailData?.data?.meta_title || "Default Title",
      description:
        astrShopDetailData?.data?.meta_description || "Default Description",
      images: [astrShopDetailData?.data?.logo || "/astrotalk-logo.webp"],
    },
  };
}

const FillIntakeServer = () => {
  return (
   <>
   <FillIntake/>
   </>
  )
}

export default FillIntakeServer
