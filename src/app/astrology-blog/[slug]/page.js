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
