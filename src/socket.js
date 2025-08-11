import { io } from 'socket.io-client';

// Use Vite env variable
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const socket = io(backendUrl, {
    transports: ['websocket', 'polling'],
});

export default socket;
