// socket.js
import { io } from "socket.io-client";
const socket = io("https://chat-backend-ckxr.onrender.com"); // Only once, not inside a function
export default socket;
