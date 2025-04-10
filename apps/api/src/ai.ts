import { WebSocket } from 'ws';

type WebpackData = Buffer | ArrayBuffer;
type AIResponse = {
    info_type: 'queue',
    status: boolean,
    people: number
} | {
    info_type: 'alert'
}

export class AI {
    socket: WebSocket | null;
    constructor() {
        try {
            this.socket = new WebSocket(`ws://localhost:${process.env.WS_PORT}`)
            this.socket.on('error', console.error.bind(null, "Socket Error: "))
        } catch {
            this.socket = null;
        }
    }

    onOpen(callback: () => void): this {
        if (!this.socket) {
            return this;
        }
        this.socket.on('open', callback);
        return this;
    }
    
    onClose(callback: () => void): this {
        if (!this.socket) {
            return this;
        }
        this.socket.on('close', callback);
        return this;
    }

    onQueue(callback: (people: number) => void): this {
        if (!this.socket) {
            return this;
        }
        this.socket.on('message', (data: WebpackData) => {
            const response: AIResponse = JSON.parse(data.toString());
            if (response.info_type != 'queue') {
                return;
            }
            callback(response.people);
        });
        return this;
    }
}