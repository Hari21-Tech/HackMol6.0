declare global {
    namespace NodeJS {
        interface ProcessEnv {
            USER: string;
            HOST: string;
            DATABASE: string;
            PASSWORD: string;
            PORT: string;
            WS_PORT: string;
            DB_PORT?: string
        }
    }
}

export {}