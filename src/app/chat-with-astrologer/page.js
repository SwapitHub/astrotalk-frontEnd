import ChatWithAstrologer from "./ChatAstrologerHome";

const fetchChatAstrologerListData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile?name=&sortby=&page=1&limit=10&languages=Bhojpuri,English,Panjabi,Hindi,Marathi&professions=Vedic,Numerology,Tarot,Face%20Reading,Psychic,Life%20Coach&gender=Male,Female&country=India,Outside_India&minAverageRating=celebrity,top_choice,rising_star,All&profileStatus=true`,
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



const fetchChatLanguageData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Language-astrologer`,
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

const fetchAdminSkillsData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-Profession-astrologer`,
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

export async function generateMetadata() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-seo-meta-by-slug/chat-with-astrologer`,
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

const ChatAstroHomeServer = async (props) => {

  const languageListData = await fetchChatLanguageData();
  const skillsListData = await fetchAdminSkillsData();
  const chatAstrologerLit = await fetchChatAstrologerListData();

  return (
    <>
      <ChatWithAstrologer languageListData={languageListData} skillsListData={skillsListData} chatAstrologerLit={chatAstrologerLit?.profiles}/>
    </>
  );
};

export default ChatAstroHomeServer;
