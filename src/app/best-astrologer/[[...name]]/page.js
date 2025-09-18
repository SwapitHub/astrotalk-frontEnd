// app/best-astrologer/[name]/page.js

import { AstrologerDetail } from "../AstrologerDetail";

// Fetch astrologer data for page content
const fetchAstrologerDetailData = async (name) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-detail/${decodeURIComponent(name)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) throw new Error("Failed to fetch astrologer data");

    return await response.json();
  } catch (error) {
    console.error("Error fetching astrologer data:", error);
    return null;
  }
};

// ✅ This gets metadata for each astrologer based on dynamic [name]
export async function generateMetadata({ params }) {
  const { name } = params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-detail/${decodeURIComponent(name)}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return {
        title: "Astrologer Not Found",
        description: "We couldn't find the astrologer you're looking for.",
      };
    }

    const data = await res.json();
console.log("data===", data);

    return {
      title: `Astro ${data?.name}: ${data?.professions?.map((item) => { return item; })} Astrologer At Astrotalk.` || "Default Astrologer Title",
      description: `${data?.name} is a well known astrologer with ${data?.experience} years’ experience. Consult ${data?.name} for love & relationship, education, finance, health, marriage.` || "Default Astrologer Description",
      keywords: `astrology predictions, kundli predictions, ask astrologer, effective astrology with our astrologers, astrotalk effective astrology, hindu astrology, vedic astrology, astrotalk book an appointment with our astrologers, cindian astrology description.` || data?.data?.meta_title,

      openGraph: {
        title: `Astro ${data?.name}: ${data?.professions?.map((item) => { return item; })} Astrologer At Astrotalk.` || "Default Astrologer Title",
        description: `${data?.name} is a well known astrologer with ${data?.experience} years’ experience. Consult ${data?.name} for love & relationship, education, finance, health, marriage.` || "Default Astrologer Description",
        url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/best-astrologer/${name}`,
        siteName: data?.data?.meta_site_name || "AstroMall",
        images: [
          {
            url:
              data?.data?.logo ||
              "/astrotalk-logo.webp",
            width: 800,
            height: 600,
            alt: data?.data?.logo_alt || "Astrologer Image",
          },
        ],
        locale: "ind",
        type: "profile",
      },

   
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}

// ✅ Actual page component for rendering astrologer detail
const AstroDetailServer = async ({ params }) => {
  const { name } = params;

  const astrologerData = await fetchAstrologerDetailData(name);

  return (
    <>
      <AstrologerDetail astrologerData={astrologerData} />
    </>
  );
};

export default AstroDetailServer;
