<template>
    <ion-app>
        <ion-menu side="end" content-id="content"></ion-menu>
        <ion-router-outlet id="content"/>
    </ion-app>
</template>

<script lang="ts">
    import {IonApp, IonRouterOutlet, IonMenu} from '@ionic/vue';
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'App',
        components: {
            IonApp,
            IonRouterOutlet,
            IonMenu
        }
    });
</script>