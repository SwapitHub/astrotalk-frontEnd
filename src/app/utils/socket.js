// src/utils/socket.js
import { io } from "socket.io-client";

// Point this to your backend server
const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
