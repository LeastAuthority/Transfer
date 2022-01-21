// import {AlertOptions} from "@ionic/core";
// import {ClientConfig} from "@/go/wormhole/types";

import {AlertOptions} from "@ionic/core";
import {ClientConfig} from "@/go/wormhole/types";

const ServerErrorMsg = 'Unfortunately, the site cannot connect to the [Product name] server. Please try again or let us know at support@domainname if the problem remains.';

export interface ErrAlertOptions extends AlertOptions {
    name?: string;
    pattern: string;
}

export class AlertError extends Error {
    public opts: ErrAlertOptions;
    public _name = 'Oops...';

    constructor(opts: ErrAlertOptions) {
        super();
        this.opts = opts;
    }

    get name(): string {
        const name = this.opts.name;
        return typeof (name) !== 'undefined' &&
        name !== '' ?
            name : this._name;
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
    message: '<p>If you’re sure this is the right code: Either the sender is no longer connected, or the code was already used.</p>' +
    '<p>Please ask the sender for a new code and for them to stay connected until you get the file.</p>',
    pattern: '',
})

export const ErrRecvConnectionTimeout = new AlertError({
    name: 'Connection time-out',
    message: '<p>It looks like the connection between you and the sender was briefly lost.</p>' +
             '<p>Please ask the sender for a new code.</p>',
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
    name: 'Network trouble?',
    message: `<p>There was an issue with either your or the receiver's connection.</p>
              <p>Please try again with a new code.</p>`,
    pattern: '(^failed to read: WebSocket closed: unclean connection.*status = StatusAbnormalClosure.*reason = ""$)|(.*$transitRelayURL.*)',
})

export const ErrInvalidCode = new Error('Please use a code with the number-word-word format.')

export const MatchableErrors = [
    ErrBadCode,
    ErrMailbox,
    ErrRelay,
    ErrInterrupt,
];
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
