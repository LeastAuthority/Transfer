// import {AlertOptions} from "@ionic/core";
// import {ClientConfig} from "@/go/wormhole/types";

import {AlertOptions} from "@ionic/core";
import {ClientConfig} from "@/go/wormhole/types";

export class AlertError extends Error {
    public opts: AlertOptions;

    constructor(opts: AlertOptions) {
        super();
        this.opts = opts;
    }

    get message() {
        return this.opts.message as string;
    }
}


class ErrMailbox extends AlertError {
    public pattern(config: ClientConfig): RegExp {
        return new RegExp(`.*${config.rendezvousURL}.*`)
    }

    public matches(errorMsg: string, config: ClientConfig): boolean {
        return this.pattern(config).test(errorMsg)
    }
}

class ErrRelay extends AlertError {
    name = 'Relay Error'

    public pattern(config: ClientConfig): RegExp {
        // TODO: improve error messaging.
        return new RegExp(`(^websocket.Dial failed$)|(.*${config.transitRelayURL}.*)`);
    }

    public matches(errorMsg: string, config: ClientConfig): boolean {
        return this.pattern(config).test(errorMsg)
    }
}

class ErrInterrupt extends AlertError {
    name = 'Connection Error'

    public pattern(config: ClientConfig): RegExp {
        // TODO: improve error messaging.
        return new RegExp(`(^failed to read: WebSocket closed: unclean connection.*status = StatusAbnormalClosure.*reason = ""$)|(.*${config.transitRelayURL}.*)`);
    }

    public matches(errorMsg: string, config: ClientConfig): boolean {
        return this.pattern(config).test(errorMsg)
    }
}

export const errReceiveNoSender = new Error('The code you used is not currently valid. Codes may only be used once. \n' +
    'Please ask the sender for a new code and to stay connected until you get the file.')
export const errMailbox = new ErrMailbox({
    message: 'Unfortunately, the site cannot connect to the [Product name] server. Please try again or let us know at support@domainname if the problem remains.',
})
export const errRelay = new ErrRelay({
    message: 'Unfortunately, the site cannot connect to the [Product name] server. Please try again or let us know at support@domainname if the problem remains.',
})
export const errInterrupt = new ErrInterrupt({
    message: 'There was an issue with either your or the receiver\'s connection. Please try again with a new code.',
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
