export const WASM_READY = 'client/wasm_ready';
export const NEW_CLIENT = 'client/new';
export const SEND_TEXT = 'client/send_text';
export const RECV_TEXT = 'client/recv_text';
export const SEND_FILE = 'client/send_file';
export const SEND_FILE_CANCEL = 'client/send_file/cancel';
export const SEND_FILE_PROGRESS = 'client/send_file/progress';
export const SEND_FILE_ERROR = 'client/send_file/error';
export const SEND_FILE_RESULT_OK = 'client/send_file/result/ok';
export const SEND_FILE_RESULT_ERROR = 'client/send_file/result/error';
export const RECV_FILE = 'client/recv_file';
export const RECV_FILE_PROGRESS = 'client/recv_file/progress';
export const RECV_FILE_OFFER = 'client/recv_file/offer';
export const RECV_FILE_OFFER_ACCEPT = 'client/recv_file/offer/accept';
export const RECV_FILE_OFFER_REJECT = 'client/recv_file/offer/reject';
export const RECV_FILE_READ = 'client/recv_file/read';
export const RECV_FILE_DATA = 'client/recv_file/data';
export const RECV_FILE_ERROR = 'client/recv_file/error';
export const RECV_FILE_READ_ERROR = 'client/recv_file/read/error';
export const FREE = 'client/free';
export const SAVE_FILE = 'client/save_file';
export const SET_CODE = 'client/set_code';

export interface ActionMessage {
    id: number;
    action: string;
    error?: Error;

    // TODO: be more specific (i.e. message types w/ union)
    [name: string]: any;
}

export function isAction(data: any): data is ActionMessage {
    return (data as ActionMessage) !== undefined;
}
