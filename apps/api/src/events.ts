import { Server } from 'socket.io';

export const setupSocketEvents = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

        socket.on('message', (data) => {
            console.log('Message received:', data);
            // Handle message event
        });

        socket.on('queue_update', (data) => {
            console.log('Queue event received:', data);
            if (!data.status) {
                return;
            }
        });
    });
};