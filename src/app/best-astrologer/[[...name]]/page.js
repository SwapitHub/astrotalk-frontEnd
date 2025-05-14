// app/best-astrologer/[name]/page.js

import { AstrologerDetail } from "../AstrologerDetail";

const fetchAstrologerDetailData = async (name) => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_WEBSITE_URL
      }/astrologer-businessProfile/${decodeURIComponent(name)}`,
      {
        cache: "no-store",
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

const AstroDetailServer = async ({ params }) => {
  const { name } = params;
  const astrologerData = await fetchAstrologerDetailData(name[0]);

  return (
    <>
      <AstrologerDetail astrologerData={astrologerData} />
    </>
  );
};

export default AstroDetailServer;
