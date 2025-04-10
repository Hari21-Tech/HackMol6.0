import { Server } from 'socket.io';

export const setUpLiveUpdates = (io: Server, tag: string) => {
    io.on('connection', (socket) => {
        console.log(`A ${tag} user connected:`, socket.id);

        socket.on('disconnect', () => {
            console.log(`A ${tag} user disconnected:`, socket.id);
        });
    });
}

export const setupSocketEvents = (
    io: Server,
    frontend_io: Server,
    admin_io: Server
) => {
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
            frontend_io.emit('queue_update', data.people);
            admin_io.emit('queue_update', data.people);
        });
    });
};