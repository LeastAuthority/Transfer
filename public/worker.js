function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
}


self.addEventListener('install', function (event) {
    console.log('service worker installed');
    // console.log(event);
    self.skipWaiting();
    // event.waitUntil(clients.Claim());
})

self.addEventListener('activate', function (event) {
    console.log('service worker activated');
    // console.log(event);
})

self.addEventListener('fetch', function (event) {
    console.log('fetch');
    console.log(event);
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/download/')) {
        const [_, data] = url.pathname.split('/download/');
        console.log('responding');
        console.log('data')
        console.log(data)
        console.log(b64toBlob(data))
        // const stream = new ReadableStream({
        //     start(controller) {
        //         console.log('hello from readableStream start');
        //         // let chars;
        //         // for (let i = 0; i < 5; i++) {
        //         //     chars = randomChars();
        //         //     console.log(chars)
        //         //     controller.enqueue(chars);
        //             controller.enqueue('olleh');
        //         // controller.enqueue([1, 2, 3, 4]);
        //         // }
        //         // controller.close();
        //     }
        // });
        // console.log('responding with');
        // const res = new Response(stream)
        // event.respondWith(res);
        event.respondWith(new Response(b64toBlob(data)));
    } else {
        console.log('not responding');
    }
});