import ChatWithAstrologer from "./ChatAstrologerHome";

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

const ChatAstroHomeServer = async (props) => {

  const languageListData = await fetchChatLanguageData();
  const skillsListData = await fetchAdminSkillsData();

  return (
    <>
      <ChatWithAstrologer languageListData={languageListData} skillsListData={skillsListData}/>
    </>
  );
};

export default ChatAstroHomeServer;
