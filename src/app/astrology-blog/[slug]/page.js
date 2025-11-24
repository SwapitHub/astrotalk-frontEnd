import React from "react";
import DetailAstrologyBlog from "./DetailAstrologyBlog";

const fetchShopDetail = async (slug) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-add-blogs-detail/${slug}`,
      {
        next: { revalidate: 60 }, 
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
  const { slug } = params;
  const astrShopDetailData = await fetchShopDetail(slug);
  if (!astrShopDetailData) return;
  return {
    title: astrShopDetailData?.title || "Default Title",
    description:
      astrShopDetailData?.meta_description || "Default Description",
    keywords:
      astrShopDetailData?.meta_keyword ||
      astrShopDetailData?.meta_title,

    openGraph: {
      title: astrShopDetailData?.meta_title || "Default Title",
      description:
        astrShopDetailData?.meta_description || "Default Description",
      url: process.env.NEXT_PUBLIC_WEBSITE_URL,
      siteName: astrShopDetailData?.meta_site_name || "Default Site Name",
      images: [
        {
          url: astrShopDetailData?.logo || "/astrotalk-logo.webp",
          width: 800,
          height: 600,
          alt: astrShopDetailData?.logo_alt || "Default Image Alt",
        },
      ],
      locale: "en_US",
      type: "website",
    },

    // Optional: Twitter metadata
    twitter: {
      card: "summary_large_image",
      title: astrShopDetailData?.meta_title || "Default Title",
      description:
        astrShopDetailData?.meta_description || "Default Description",
      images: [astrShopDetailData?.logo || "/astrotalk-logo.webp"],
    },
  };
}

const BlogsDetailServer = async ({ params }) => {
  const { slug } = params;
  const blogsDetailData = await fetchShopDetail(slug);

  return (
    <>
      <DetailAstrologyBlog blogsDetailData={blogsDetailData} />
    </>
  );
};

export default BlogsDetailServer;
