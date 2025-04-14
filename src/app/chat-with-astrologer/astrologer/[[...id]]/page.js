import Chatting from "./Chatting";

const fetchChatAstrologerData = async (astrologerId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/${astrologerId}`, {
      cache: "no-store", // Ensure fresh data is fetched
    });

    if (!response.ok) {
      throw new Error("Failed to fetch astrologer data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching astrologer data:", error);
    return null; // Return null or handle errors gracefully
  }
};

const ChattingServer = async ({ params }) => {
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Handle dynamic routing properly


  const astrologer = await fetchChatAstrologerData(id);

  return (
    <>
      <Chatting astrologer={astrologer} />
    </>
  );
};

export default ChattingServer;
