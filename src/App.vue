<template>
    <ion-app>
        <Main id="content"></Main>
    </ion-app>
</template>

<style lang="css">
/*
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
*/
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

a {
    text-decoration: none;
}

.italic {
    font-style: italic;
}

/* NB: disable dark mode */
@media (prefers-color-scheme: dark) {
  body {
    --ion-background-color: initial !important;
    --ion-background-color-rgb: initial !important;
    --ion-text-color: initial !important;
    --ion-text-color-rgb: initial !important;
    --ion-border-color: initial !important;
    --ion-color-step-50: initial !important;
    --ion-color-step-100: initial !important;
    --ion-color-step-150: initial !important;
    --ion-color-step-200: initial !important;
    --ion-color-step-250: initial !important;
    --ion-color-step-300: initial !important;
    --ion-color-step-350: initial !important;
    --ion-color-step-400: initial !important;
    --ion-color-step-450: initial !important;
    --ion-color-step-500: initial !important;
    --ion-color-step-550: initial !important;
    --ion-color-step-600: initial !important;
    --ion-color-step-650: initial !important;
    --ion-color-step-700: initial !important;
    --ion-color-step-750: initial !important;
    --ion-color-step-800: initial !important;
    --ion-color-step-850: initial !important;
    --ion-color-step-900: initial !important;
    --ion-color-step-950: initial !important;
    --ion-item-background: initial !important;
    --ion-toolbar-background: initial !important;
    --ion-tab-bar-background: initial !important;
    --ion-card-background: initial !important;
  }
}

.bold {
    font-weight: 700 !important;
}

ion-button.large-button {
    width: 135px;
    height: 135px;
}

ion-button.large-button ion-icon {
    font-size: 140px;
    position: absolute;
    top: 0;
    bottom: 0;
    padding: 0;
    margin: auto;
}

:root * {
    font-family: 'Poppins', sans-serif !important;
    text-transform: initial;
    letter-spacing: initial;
}

:root ion-content {
    --background: transparent;
}

:root body {
    background: linear-gradient(222.19deg, #F0F0F0 23.77%, #FFFFFF 98.02%);
}

.flex {
    display: flex;
}

.flex-col {
    display: flex;
    flex-direction: column;
}

ion-progress-bar {
    height: 40px;
}

ion-card, ion-button, ion-input {
    border-radius: 8px;
}

/*
@media screen and (max-height: 379px) {
    ion-card {
        max-height: 55vh;
    }
}

@media screen and (min-height: 380px) and (max-height: 499px) {
    ion-card {
        max-height: 60vh;
    }
}

@media screen and (min-height: 500px) and (max-height: 649px) {
    ion-card {
        max-height: 70vh;
    }
}

@media screen and (min-height: 650px) {
    ion-card {
        max-height: 490px;
    }
}*/

ion-button {
    font-weight: 600;
    font-size: 13px;
}

ion-input {
    background-color: var(--ion-color-light-grey) !important;
    color: var(--ion-color-black) !important;
    font-weight: 500;
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
    --ion-color-black: #282f39;
    --ion-color-black-rgb: 40, 47, 57;
    --ion-color-black-contrast: #ffffff;
    --ion-color-black-contrast-rgb: 255, 255, 255;
    --ion-color-black-shade: #232932;
    --ion-color-black-tint: #3e444d;
    --ion-color-yellow: #ffc64e;
    --ion-color-yellow-rgb: 255, 198, 78;
    --ion-color-yellow-contrast: var(--ion-color-black);
    --ion-color-yellow-contrast-rgb: 0, 0, 0;
    --ion-color-yellow-shade: #e0ae45;
    --ion-color-yellow-tint: #ffcc60;
    --ion-color-blue: #00d4e5;
    --ion-color-blue-rgb: 0, 212, 229;
    --ion-color-blue-contrast: var(--ion-color-black);
    --ion-color-blue-contrast-rgb: 0, 0, 0;
    --ion-color-blue-shade: #00bbca;
    --ion-color-blue-tint: #1ad8e8;
    --ion-color-tertiary: #87b3fc;
    --ion-color-tertiary-rgb: 135, 179, 252;
    --ion-color-tertiary-contrast: #000000;
    --ion-color-tertiary-contrast-rgb: 0, 0, 0;
    --ion-color-tertiary-shade: #779ede;
    --ion-color-tertiary-tint: #93bbfc;
    --ion-color-success: #2dd36f;
    --ion-color-success-rgb: 45, 211, 111;
    --ion-color-success-contrast: #ffffff;
    --ion-color-success-contrast-rgb: 255, 255, 255;
    --ion-color-success-shade: #28ba62;
    --ion-color-success-tint: #42d77d;
    --ion-color-warning-red: #ff6f6f;
    --ion-color-warning-red-rgb: 255, 111, 111;
    --ion-color-warning-red-contrast: #000000;
    --ion-color-warning-red-contrast-rgb: 0, 0, 0;
    --ion-color-warning-red-shade: #e06262;
    --ion-color-warning-red-tint: #ff7d7d;
    --ion-color-danger: #eb445a;
    --ion-color-danger-rgb: 235, 68, 90;
    --ion-color-danger-contrast: #ffffff;
    --ion-color-danger-contrast-rgb: 255, 255, 255;
    --ion-color-danger-shade: #cf3c4f;
    --ion-color-danger-tint: #ed576b;
    --ion-color-darker-grey: #4f4f4f;
    --ion-color-darker-grey-rgb: 79,79,79;
    --ion-color-darker-grey-contrast: #ffffff;
    --ion-color-darker-grey-contrast-rgb: 255,255,255;
    --ion-color-darker-grey-shade: #464646;
    --ion-color-darker-grey-tint: #616161;
    --ion-color-dark-grey: #6d6d6d;
    --ion-color-dark-grey-rgb: 109, 109, 109;
    --ion-color-dark-grey-contrast: #ffffff;
    --ion-color-dark-grey-contrast-rgb: 255, 255, 255;
    --ion-color-dark-grey-shade: #606060;
    --ion-color-dark-grey-tint: #7c7c7c;
    --ion-color-medium-grey: #c4c4c4;
    --ion-color-medium-grey-rgb: 196, 196, 196;
    --ion-color-medium-grey-contrast: var(--ion-color-black);
    --ion-color-medium-grey-contrast-rgb: 0, 0, 0;
    --ion-color-medium-grey-shade: #acacac;
    --ion-color-medium-grey-tint: #cacaca;
    --ion-color-light-grey: #efeff1;
    --ion-color-light-grey-rgb: 239,239,241;
    --ion-color-light-grey-contrast: var(--ion-color-black);
    --ion-color-light-grey-contrast-rgb: 0,0,0;
    --ion-color-light-grey-shade: #d2d2d4;
    --ion-color-light-grey-tint: #f1f1f2;
    --ion-color-progress-grey: #858789;
    --ion-color-progress-grey-rgb: 133,135,137;
    --ion-color-progress-grey-contrast: #000000;
    --ion-color-progress-grey-contrast-rgb: 0,0,0;
    --ion-color-progress-grey-shade: #757779;
    --ion-color-progress-grey-tint: #919395;
}

.ion-color-black {
  --ion-color-base: var(--ion-color-black);
  --ion-color-base-rgb: var(--ion-color-black-rgb);
  --ion-color-contrast: var(--ion-color-black-contrast);
  --ion-color-contrast-rgb: var(--ion-color-black-contrast-rgb);
  --ion-color-shade: var(--ion-color-black-shade);
  --ion-color-tint: var(--ion-color-black-tint);
}

.ion-color-light-grey {
    --ion-color-base: var(--ion-color-light-grey);
    --ion-color-base-rgb: var(--ion-color-light-grey-rgb);
    --ion-color-contrast: var(--ion-color-light-grey-contrast);
    --ion-color-contrast-rgb: var(--ion-color-light-grey-contrast-rgb);
    --ion-color-shade: var(--ion-color-light-grey-shade);
    --ion-color-tint: var(--ion-color-light-grey-tint);
}


.ion-color-progress-grey {
    --ion-color-base: var(--ion-color-progress-grey);
    --ion-color-base-rgb: var(--ion-color-progress-grey-rgb);
    --ion-color-contrast: var(--ion-color-progress-grey-contrast);
    --ion-color-contrast-rgb: var(--ion-color-progress-grey-contrast-rgb);
    --ion-color-shade: var(--ion-color-progress-grey-shade);
    --ion-color-tint: var(--ion-color-progress-grey-tint);
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

.ion-color-darker-grey {
    --ion-color-base: var(--ion-color-darker-grey);
    --ion-color-base-rgb: var(--ion-color-darker-grey-rgb);
    --ion-color-contrast: var(--ion-color-darker-grey-contrast);
    --ion-color-contrast-rgb: var(--ion-color-darker-grey-contrast-rgb);
    --ion-color-shade: var(--ion-color-darker-grey-shade);
    --ion-color-tint: var(--ion-color-darker-grey-tint);
}

.ion-color-dark-grey {
    --ion-color-base: var(--ion-color-dark-grey);
    --ion-color-base-rgb: var(--ion-color-dark-grey-rgb);
    --ion-color-contrast: var(--ion-color-dark-grey-contrast);
    --ion-color-contrast-rgb: var(--ion-color-dark-grey-contrast-rgb);
    --ion-color-shade: var(--ion-color-dark-grey-shade);
    --ion-color-tint: var(--ion-color-dark-grey-tint);
}

.ion-color-medium-grey {
    --ion-color-base: var(--ion-color-medium-grey);
    --ion-color-base-rgb: var(--ion-color-medium-grey-rgb);
    --ion-color-contrast: var(--ion-color-medium-grey-contrast);
    --ion-color-contrast-rgb: var(--ion-color-medium-grey-contrast-rgb);
    --ion-color-shade: var(--ion-color-medium-grey-shade);
    --ion-color-tint: var(--ion-color-medium-grey-tint);
}

.ion-color-light-grey {
    --ion-color-base: var(--ion-color-light-grey);
    --ion-color-base-rgb: var(--ion-color-light-grey-rgb);
    --ion-color-contrast: var(--ion-color-light-grey-contrast);
    --ion-color-contrast-rgb: var(--ion-color-light-grey-contrast-rgb);
    --ion-color-shade: var(--ion-color-light-grey-shade);
    --ion-color-tint: var(--ion-color-light-grey-tint);
}

.ion-color-warning-red {
    --ion-color-base: var(--ion-color-warning-red);
    --ion-color-base-rgb: var(--ion-color-warning-red-rgb);
    --ion-color-contrast: var(--ion-color-warning-red-contrast);
    --ion-color-contrast-rgb: var(--ion-color-warning-red-contrast-rgb);
    --ion-color-shade: var(--ion-color-warning-red-shade);
    --ion-color-tint: var(--ion-color-warning-red-tint);
}

.slide-right-enter-active, .slide-left-enter-active {
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
        Main,
    }
});
</script>
