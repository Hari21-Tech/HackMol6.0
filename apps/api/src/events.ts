import { Server } from 'socket.io';

export const setUpLiveUpdates = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('A frontend user connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('A frontend user disconnected:', socket.id);
        });
    });
}

export const setupSocketEvents = (io: Server, frontend_io: Server) => {
    io.on('connection', (socket) => {
        console.log('An ai connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('AI disconnected:', socket.id);
        });

        socket.on('queue_update', (data) => {
            console.log('Queue event received:', data);
            if (!data.status) {
                return;
            }
            frontend_io.emit('queue_update', {
                people: data.people
            })
        });
    });
};