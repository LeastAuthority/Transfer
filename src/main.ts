import {IonicVue} from '@ionic/vue';
import {createApp} from 'vue'

import App from '@/App.vue'
import router from '@/router';
import Go from '@/go';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {FileStreamReader} from "@/go/wormhole/streaming";

const app = createApp(App)
    .use(IonicVue)
    .use(router);

const routerReady = router.isReady();

const wasmWorker = new Worker(`${window.location.origin}/worker.js`);
const channel = new MessageChannel();
// wasmWorker.postMessage(null)
wasmWorker.postMessage(null, [channel.port2])
const wasmReady = new Promise((resolve, reject) => {
    channel.port1.onmessage = function(event) {
        if (event.data === 'ready:wasm') {
            resolve();
            return;
        }
        reject(event.data);
    }
})

// Promise.all([routerReady, wasmReady]).then(() => {
Promise.all([routerReady, wasmReady]).then(() => {
    app.mount('#app');
});
