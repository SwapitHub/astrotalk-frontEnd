import Chatting from "./Chatting";

const fetchChatAstrologerData = async (astrologerId) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/${astrologerId}`, {
    cache: "no-store"
  });
  return res.ok ? await res.json() : null;
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
