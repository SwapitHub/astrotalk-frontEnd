// src/utils/socket.js
import { io } from "socket.io-client";

// apna backend URL daalna (localhost ya deployed server ka)
const socket = io(`${process.env.NEXT_PUBLIC_WEBSITE_URL}`, { transports: ["websocket"] });

export default socket;
