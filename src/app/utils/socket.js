// src/utils/socket.js
import { io } from "socket.io-client";

// Point this to your backend server
const socket = io(`${process.env.NEXT_PUBLIC_WEBSITE_URL}`, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
