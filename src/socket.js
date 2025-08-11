import { io } from 'socket.io-client';

// Use of env variable with fallback to localhost for local dev
const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

console.log("Connecting to Socket.io at:", backendURL);

const socket = io(backendURL, {
    transports: ['websocket', 'polling'],
});

export default socket;
