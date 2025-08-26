"use client"
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function CreateMeetingLink() {
  const router = useRouter();

  const createMeeting = () => {
    const roomId = uuidv4();
    router.push(`/call/${roomId}`);
  };

  return (
    <div>
      <h1>Welcome to My Meet</h1>
      <button onClick={createMeeting}>Start New Meeting</button>
    </div>
  );
}
