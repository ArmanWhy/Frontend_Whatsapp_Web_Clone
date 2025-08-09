import { io } from 'socket.io-client';

// Change URL to backend's address

const socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
});

export default socket;