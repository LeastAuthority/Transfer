<template>
    <ion-app>
        <Main id="content"></Main>
<!--        <ion-menu side="end" content-id="content"></ion-menu>-->
<!--        <ion-router-outlet id="content"/>-->
    </ion-app>
</template>

<style lang="css">
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
:root * {
    font-family: 'Poppins', sans-serif !important;
}

:root ion-content {
    --background: transparent;
}

:root body {
    background: #f1f1f1;
}

ion-footer {
    background: transparent;
}

/*
body {
    background-color: #f1f1f1;
}

#background-content {
    background-color: transparent;
}
*/

:root {
    --ion-color-yellow: #FFC64E;
    --ion-color-yellow-rgb: 255,198,78;
    --ion-color-yellow-contrast: #000000;
    --ion-color-yellow-contrast-rgb: 0,0,0;
    --ion-color-yellow-shade: #E0AE45;
    --ion-color-yellow-tint: #FFCC60;
    --ion-color-blue: #00D4E5;
    --ion-color-blue-rgb: 0,212,229;
    --ion-color-blue-contrast: #000000;
    --ion-color-blue-contrast-rgb: 0,0,0;
    --ion-color-blue-shade: #00BBCA;
    --ion-color-blue-tint: #1AD8E8;
    --ion-color-tertiary: #87B3FC;
    --ion-color-tertiary-rgb: 135,179,252;
    --ion-color-tertiary-contrast: #000000;
    --ion-color-tertiary-contrast-rgb: 0,0,0;
    --ion-color-tertiary-shade: #779EDE;
    --ion-color-tertiary-tint: #93BBFC;
    --ion-color-success: #2DD36F;
    --ion-color-success-rgb: 45,211,111;
    --ion-color-success-contrast: #FFFFFF;
    --ion-color-success-contrast-rgb: 255,255,255;
    --ion-color-success-shade: #28BA62;
    --ion-color-success-tint: #42D77D;
    --ion-color-warning: #FF6F6F;
    --ion-color-warning-rgb: 255,111,111;
    --ion-color-warning-contrast: #000000;
    --ion-color-warning-contrast-rgb: 0,0,0;
    --ion-color-warning-shade: #E06262;
    --ion-color-warning-tint: #FF7D7D;
    --ion-color-danger: #EB445A;
    --ion-color-danger-rgb: 235,68,90;
    --ion-color-danger-contrast: #FFFFFF;
    --ion-color-danger-contrast-rgb: 255,255,255;
    --ion-color-danger-shade: #CF3C4F;
    --ion-color-danger-tint: #ED576B;
    --ion-color-dark: #222428;
    --ion-color-dark-rgb: 34,36,40;
    --ion-color-dark-contrast: #FFFFFF;
    --ion-color-dark-contrast-rgb: 255,255,255;
    --ion-color-dark-shade: #1E2023;
    --ion-color-dark-tint: #383A3E;
    --ion-color-medium: #92949C;
    --ion-color-medium-rgb: 146,148,156;
    --ion-color-medium-contrast: #FFFFFF;
    --ion-color-medium-contrast-rgb: 255,255,255;
    --ion-color-medium-shade: #808289;
    --ion-color-medium-tint: #9D9FA6;
    --ion-color-light: #F4F5F8;
    --ion-color-light-rgb: 244,245,248;
    --ion-color-light-contrast: #000000;
    --ion-color-light-contrast-rgb: 0,0,0;
    --ion-color-light-shade: #D7D8DA;
    --ion-color-light-tint: #F5F6F9;
}

.ion-color-yellow {
    --ion-color-base: var(--ion-color-yellow);
    --ion-color-base-rgb: var(--ion-color-yellow-rgb);
    --ion-color-contrast: var(--ion-color-yellow-contrast);
    --ion-color-contrast-rgb: var(--ion-color-yellow-contrast-rgb);
    --ion-color-shade: var(--ion-color-yellow-shade);
    --ion-color-tint: var(--ion-color-yellow-tint);
}

.ion-color-blue {
    --ion-color-base: var(--ion-color-blue);
    --ion-color-base-rgb: var(--ion-color-blue-rgb);
    --ion-color-contrast: var(--ion-color-blue-contrast);
    --ion-color-contrast-rgb: var(--ion-color-blue-contrast-rgb);
    --ion-color-shade: var(--ion-color-blue-shade);
    --ion-color-tint: var(--ion-color-blue-tint);
}

/*
:root {
    --ion-color-yellow: #ffc64e;
    --ion-color-yellow-rgb: 255,198,78;
    --ion-color-yellow-contrast: #000000;
    --ion-color-yellow-contrast-rgb: 0,0,0;
    --ion-color-yellow-shade: #e0ae45;
    --ion-color-yellow-tint: #ffcc60;
}

.ion-color-yellow {
    --ion-color-base: var(--ion-color-yellow);
    --ion-color-base-rgb: var(--ion-color-yellow-rgb);
    --ion-color-contrast: var(--ion-color-yellow-contrast);
    --ion-color-contrast-rgb: var(--ion-color-yellow-contrast-rgb);
    --ion-color-shade: var(--ion-color-yellow-shade);
    --ion-color-tint: var(--ion-color-yellow-tint);
} */

.slide-right-enter-active, .slide-right-leave-active,
.slide-left-enter-active, .slide-left-leave-active {
    transition: transform .3s ease, opacity .3s ease;
}

.slide-right-enter-from, .slide-right-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

.slide-left-enter-from, .slide-left-leave-to {
    transform: translateX(-10px);
    opacity: 0;
}
</style>

<script lang="ts">
    import {IonApp, IonRouterOutlet, IonMenu} from '@ionic/vue';
    import {defineComponent} from 'vue';
    import Main from "@/views/Main.vue";

    export default defineComponent({
        name: 'App',
        components: {
            IonApp,
            // IonRouterOutlet,
            // IonMenu
            Main,
        }
    });
</script>
