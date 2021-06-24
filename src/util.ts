// NB: wormhole-william relay timeout is 5s.
export const SENDER_TIMEOUT = 5000;

export function durationToClosesUnit(seconds: number): string {
    let minString = '';
    const secString = `${seconds % 60} sec. remaining`;
    if (seconds > 60) {
        minString = `${Math.floor(seconds / 60)} min. and `;
    }
    return minString + secString;
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

