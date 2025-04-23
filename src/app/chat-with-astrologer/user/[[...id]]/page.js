import Chatting from "./Chatting";

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

const ChattingServer = async () => {
 
  const AdminCommissionData = await fetchAdminCommissionData();
  return (
    <>
      <Chatting AdminCommissionData={AdminCommissionData[0].AdminCommissions}/>
    </>
  );
};
export default ChattingServer;
