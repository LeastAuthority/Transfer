// NB: wormhole-william relay timeout is 5s.
export const SENDER_TIMEOUT = 10000;

export const CODE_REGEX = /^\d+-\w+-\w+$/;

export function durationToClosesUnit(seconds: number): string {
    let minString = '';
    const secString = `${seconds % 60} sec. remaining`;
    if (seconds > 60) {
        minString = `${Math.round(seconds / 60)} min. remaining`;
        return minString;
    }
    return secString;
}

export function sizeToClosestUnit(fileSizeInBytes: number): string {
    let i = -1;
    const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1000;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

export function extension(name: string): string {
    if (typeof (name) === 'undefined') {
        return '';
    }

    const parts = name.split('.')
    if (parts.length === 1) {
        return '';
    }

    return parts.reverse()[0];
}

export function basename(name: string): string {
    if (typeof (name) === 'undefined') {
        return '';
    }

    const parts = name.split('.')
    if (parts.length === 1)  {
        return name;
    }

    return parts
        .filter((part: string) => part !== extension(name))
        .join('.');
}

export function sizeWithUnit(size: number): string {
    return sizeToClosestUnit(size);
}
