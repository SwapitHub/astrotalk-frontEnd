import Chatting from "../Chatting";

const fetchChatAstrologerData = async (astrologerId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/${astrologerId}`,
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

const fetchAdminCommissionData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/add-AdminCommission-astrologer`,
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

const ChattingServer = async (props) => {
  const { id } = await props.params;

  const astrologer = await fetchChatAstrologerData(id);
  const AdminCommissionData = await fetchAdminCommissionData();
console.log("AdminCommissionData",AdminCommissionData[0].AdminCommissions);

  return (
    <>
      <Chatting astrologer={astrologer} AdminCommissionData={AdminCommissionData[0].AdminCommissions}/>
    </>
  );
};

export default ChattingServer;
