export interface WindowWormhole {
    Client: WindowClient;
}

export interface WindowClient {
    newClient(config?: ClientConfig): number;
    sendText(goClient: number, message: string): Promise<string>;
    sendFile(goClient: number, fileName: string, fileData: Uint8Array): Promise<string>;
    recvText(goClient: number, code: string): Promise<string>;
    recvFile(goClient: number, code: string): Promise<Uint8Array>;
    free(goClient: number): string | undefined;
}

export interface ClientConfig {
    rendezvousURL: string;
    transitRelayAddress: string;
    // TODO: int
    passPhraseComponentLength: number;
}

export const wormhole: WindowWormhole = new Proxy({Client: {} as WindowClient}, {
    get(target, prop, receiver) {
        switch (prop) {
            case 'Client':
                return (window as any).Wormhole.Client
        }
    }
});
