import io from 'socket.io-client';
import { API_URL } from './api'; // Import your base URL

// Remove /api/v1 from API_URL to get base server URL
const SERVER_URL = API_URL.replace('/api/v1', '');

let socket;

export const initiateSocket = () => {
    if (!socket) {
        socket = io(SERVER_URL, {
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initiateSocket();
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
