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

ion-progress-bar {
    height: 40px;
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
    --ion-color-yellow: #ffc64e;
    --ion-color-yellow-rgb: 255,198,78;
    --ion-color-yellow-contrast: #000000;
    --ion-color-yellow-contrast-rgb: 0,0,0;
    --ion-color-yellow-shade: #e0ae45;
    --ion-color-yellow-tint: #ffcc60;
    --ion-color-blue: #00d4e5;
    --ion-color-blue-rgb: 0,212,229;
    --ion-color-blue-contrast: #000000;
    --ion-color-blue-contrast-rgb: 0,0,0;
    --ion-color-blue-shade: #00bbca;
    --ion-color-blue-tint: #1ad8e8;
    --ion-color-tertiary: #87b3fc;
    --ion-color-tertiary-rgb: 135,179,252;
    --ion-color-tertiary-contrast: #000000;
    --ion-color-tertiary-contrast-rgb: 0,0,0;
    --ion-color-tertiary-shade: #779ede;
    --ion-color-tertiary-tint: #93bbfc;
    --ion-color-success: #2dd36f;
    --ion-color-success-rgb: 45,211,111;
    --ion-color-success-contrast: #ffffff;
    --ion-color-success-contrast-rgb: 255,255,255;
    --ion-color-success-shade: #28ba62;
    --ion-color-success-tint: #42d77d;
    --ion-color-warning: #ff6f6f;
    --ion-color-warning-rgb: 255,111,111;
    --ion-color-warning-contrast: #000000;
    --ion-color-warning-contrast-rgb: 0,0,0;
    --ion-color-warning-shade: #e06262;
    --ion-color-warning-tint: #ff7d7d;
    --ion-color-danger: #eb445a;
    --ion-color-danger-rgb: 235,68,90;
    --ion-color-danger-contrast: #ffffff;
    --ion-color-danger-contrast-rgb: 255,255,255;
    --ion-color-danger-shade: #cf3c4f;
    --ion-color-danger-tint: #ed576b;
    --ion-color-dark: #282f39;
    --ion-color-dark-rgb: 40,47,57;
    --ion-color-dark-contrast: #ffffff;
    --ion-color-dark-contrast-rgb: 255,255,255;
    --ion-color-dark-shade: #232932;
    --ion-color-dark-tint: #3e444d;
    --ion-color-medium: #6d6d6d;
    --ion-color-medium-rgb: 109,109,109;
    --ion-color-medium-contrast: #ffffff;
    --ion-color-medium-contrast-rgb: 255,255,255;
    --ion-color-medium-shade: #606060;
    --ion-color-medium-tint: #7c7c7c;
    --ion-color-grey: #c4c4c4;
    --ion-color-grey-rgb: 196,196,196;
    --ion-color-grey-contrast: #000000;
    --ion-color-grey-contrast-rgb: 0,0,0;
    --ion-color-grey-shade: #acacac;
    --ion-color-grey-tint: #cacaca;
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

.ion-color-grey {
    --ion-color-base: var(--ion-color-grey);
    --ion-color-base-rgb: var(--ion-color-grey-rgb);
    --ion-color-contrast: var(--ion-color-grey-contrast);
    --ion-color-contrast-rgb: var(--ion-color-grey-contrast-rgb);
    --ion-color-shade: var(--ion-color-grey-shade);
    --ion-color-tint: var(--ion-color-grey-tint);
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
