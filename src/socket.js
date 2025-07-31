// socket.js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000"); // Only once, not inside a function
export default socket;
