export const WASM_READY = 'client/wasm_ready';
export const NEW_CLIENT = 'client/new';
export const SEND_TEXT = 'client/send_text';
export const RECV_TEXT = 'client/recv_text';
export const SEND_FILE = 'client/send_file';
export const RECV_FILE = 'client/recv_file';
export const FREE = 'client/free';

declare interface ActionMessage {
    id: number;
    action: string;
    error?: Error;

    [name: string]: any;
}

export function isAction(data: any): data is ActionMessage {
    return (data as ActionMessage) !== undefined;
}

