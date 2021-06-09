<template>
    <ion-app>
        <ion-menu side="end" content-id="content"></ion-menu>
        <ion-router-outlet id="content"/>
    </ion-app>
</template>

<style lang="css">
// TODO: is this really okay to do?
* {
    font-family: 'Poppins', serif !important;
}
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
</style>

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
