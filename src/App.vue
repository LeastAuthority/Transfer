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

.bold {
    font-weight: 700;
}

:root * {
    font-family: 'Poppins', sans-serif !important;
    text-transform: initial;
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
    --ion-color-warning: #ff6f6f;
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
