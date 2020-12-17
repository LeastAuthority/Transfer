<template>
    <ion-app>
        <ion-menu side="end" content-id="content"></ion-menu>
        <ion-router-outlet id="content"/>
    </ion-app>
</template>

<script lang="ts">
    import {IonApp, IonRouterOutlet, IonMenu} from '@ionic/vue';
    import {defineComponent} from 'vue';
    import Go from './go';

    const go = new Go();
    WebAssembly.instantiateStreaming(fetch("/assets/wormhole.wasm"), go.importObject).then((result) => {
        go.run(result.instance);
    });

    export default defineComponent({
        name: 'App',
        components: {
            IonApp,
            IonRouterOutlet,
            IonMenu
        }
    });
</script>