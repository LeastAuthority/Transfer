// import {AlertOptions} from "@ionic/core";
// import {ClientConfig} from "@/go/wormhole/types";

import {AlertOptions} from "@ionic/core";
import {ClientConfig} from "@/go/wormhole/types";

const ServerErrorMsg = 'Unfortunately, the site cannot connect to the [Product name] server. Please try again or let us know at support@domainname if the problem remains.';

export interface ErrAlertOptions extends AlertOptions {
    pattern: string;
}

export class AlertError extends Error {
    public opts: ErrAlertOptions;
    public name = 'Oops...';

    constructor(opts: ErrAlertOptions) {
        super();
        this.opts = opts;
    }

    get message(): string {
        return this.opts.message as string;
    }

    public matches(errorMsg: string, config: ClientConfig): boolean {
        const pattern = this.opts.pattern
            .replace('$rendezvousURL', config.rendezvousURL)
            .replace('$transitRelayURL', config.transitRelayURL);
        return (new RegExp(pattern)).test(errorMsg);
    }
}

export const ErrBadCode = new AlertError({
    message: 'The code you used is not currently valid. Codes may only be used once. \n' +
        'Please ask the sender for a new code and to stay connected until you get the file.',
    pattern: '',
})

export const ErrMailbox = new AlertError({
    message: ServerErrorMsg,
    pattern: '.*$rendezvousURL.*',
})

export const ErrRelay = new AlertError({
    message: ServerErrorMsg,
    pattern: '(^websocket.Dial failed|failed to establish connection$)|(.*$transitRelayURL.*)',
})

export const ErrInterrupt = new AlertError({
    message: 'There was an issue with either your or the receiver\'s connection. Please try again with a new code.',
    pattern: '(^failed to read: WebSocket closed: unclean connection.*status = StatusAbnormalClosure.*reason = ""$)|(.*$transitRelayURL.*)',
})

// export class ReceiveError extends Error {
//     // name = 'ReceiveError'
//     message = 'No sender seen, check the code and try again.';
// }

// export interface Error {
//     alert: AlertOptions
// }
//
// // TODO: something core comprehensive
// export const Errors: Error[] = [
//
// ];
//
// export function matchError(errorMsg: string, config: ClientConfig): Error {
//
//     (new RegExp(`.*${config.rendezvousURL}.*`)).test(errorMsg)
// }
