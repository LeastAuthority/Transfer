<template>
    <ion-page>
        <div class="bg">
            <div class="bg-circle"></div>
        </div>
        <ion-content>
            <ion-grid>
                <ion-row class="ion-margin-top ion-align-items-center">
                    <ion-col size="6">
                        <ion-text color="black"
                                  class="transfer-text"
                                  @click="goToSendReload">
                            Transfer
                        </ion-text>
                    </ion-col>
                    <ion-col size="6" class="flex ion-justify-content-end">
                        <ion-button color="medium-grey"
                                    class="ion-margin-end nav-button"
                                    @click="toggleNav()">
                            <ion-icon slot="start"
                                      :icon="navIcon"></ion-icon>
                            <ion-label class="ion-text-uppercase" slot="end">
                                {{ navButtonText }}
                            </ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="router-view-col">
                        <router-view v-slot="{ Component, route }">
                            <transition :name="route.meta.transition">
                                <component :is="Component"></component>
                            </transition>
                        </router-view>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
        <ion-footer class="ion-no-border">
            <ion-grid class=" ion-margin-horizontal ion-padding-horizontal">
                <ion-row>
                    <ion-col class="footer" sizeXs="12" sizeMd="6">
                        <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    Security
                                </ion-text>
                            </a>
                        </ion-col>
                        <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    Privacy
                                </ion-text>
                            </a>
                        </ion-col>
                        <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    About Us
                                </ion-text>
                            </a>
                        </ion-col>
                        <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    GitHub
                                </ion-text>
                            </a>
                        </ion-col>
                    </ion-col>
                    <ion-col sizeXs="12" sizeMd="6" class="made-with-love flex ion-justify-content-end">
                        <ion-text color="dark-grey">
                            made with love for privacy by
                        </ion-text>
                        <div class="la-logo"></div>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-footer>
    </ion-page>
</template>

<style lang="css">
ion-card-title {
    margin: var(--md-margin);

    font-size: 40px;
}

ion-card-subtitle {
    margin-left: var(--md-margin);
    margin-right: var(--md-margin);

    font-size: 14px;
    font-weight: 500;
}

ion-card-subtitle > * {
    margin-bottom: var(--md-margin);
}

ion-card-header {
    padding: var(--card-padding) !important;
}

ion-card-content {
    padding: var(--card-padding) !important;
}

ion-card-content p ion-text {
    font-size: 14px;
    font-weight: 500;
}

ion-card {
    margin: var(--card-margin) !important;
}

.router-view-col {
    padding-top: 0;
    position: initial;
}

.transfer-text {
    position: relative;
}

.w-logo {
    position: absolute;
    width: 100px;
    height: 100px;
    background-image: url("/assets/logos/logo.svg");
}

.transfer-text {
    font-size: 36px;
    margin: 0 0 0 var(--header-margin-left);
}

:root {
    --max-width: 1100px;
    --sm-margin: 8px;
    --md-margin: calc(2 * var(--sm-margin));
    --ion-padding: 8px;
    --card-margin: var(--sm-margin);
    --card-padding: var(--ion-padding);

    --header-margin-left: calc(var(--card-margin) + var(--card-padding) + 16px);
    --header-margin-right: calc(var(--card-margin) + var(--card-padding) + 4px);
}

h1.party-popper {
    font-size: 60px;
}

.alert-wrapper {
    background-color: var(--ion-color-light-grey) !important;
}

.alert-message {
    color: var(--ion-color-black) !important;
}
</style>

<style lang="css" scoped>
.ion-page {
    align-items: center;
}

ion-footer {
    background: transparent;
    font-size: 13px;
    font-weight: 600;
}

ion-content, ion-footer {
    max-width: var(--max-width);
}

/*
ion-icon.nav {
    transition: transform .3s ease;
} */

.nav-button {
    margin-right: var(--header-margin-right);
}

.nav-button ion-icon[rotate=true] {
    transform: rotate(-90deg);
}

.pointer {
    cursor: pointer;
}

.la-logo {
    background-image: url("/assets/logos/la-logo.svg");
    width: 143px;
    height: 28px;
    background-repeat: no-repeat;
    background-size: 140px;
}

.bg {
    z-index: -100;
    overflow: hidden;
    position: absolute;
    height: 100vh;
    width: 100vw;
}

.bg-circle {
    position: relative;
    clip-path: circle(45vw);
    top: 0vw;
    left: -4vw;
    height: 134vh;
    width: 100vw;
    background: #9EE6F5;
}

@media screen and (max-width: 992px) {
    .bg-circle {
        clip-path: circle(55vw);
        top: -4vw;
        left: -48vw;
        width: 170vw;
        height: 120vh;
    }
}

@media screen and (max-width: 767px) {
    .footer {
        order: 1;
        text-align: center;
    }

    .made-with-love.ion-justify-content-end {
        justify-content: center !important;
    }
}

@media screen and (max-width: 575px) {
    .bg-circle {
        clip-path: circle(85vw);
        left: -50vw;
        width: 150vw;
    }
}
</style>

<script lang="ts">

import {Component, defineComponent, Transition} from "vue";
import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonLabel,
    IonPage,
    IonRow,
    IonText,
    IonFooter
} from "@ionic/vue";
import {sendOutline, sendSharp} from 'ionicons/icons';
import Send from "@/views/Send.vue";
import Receive from "@/views/Receive.vue";
import {RouterView} from "vue-router";
import {SendStep} from "@/types";

export default defineComponent({
    computed: {
        navComponent(): Component {
            return this.$route.path === '/s' ? Send : Receive;
        },
        navIcon(): string {
            return this.$route.path === '/s' ? '/assets/icon/download.svg' : sendSharp;
        },
        navButtonText(): string {
            return this.$route.path === '/s' ? 'Receive' : 'Send';
        },
        navHref(): string {
            return this.$route.path === '/s' ? '/r' : '/s';
        },
        rotated(): boolean {
            return this.$route.path !== '/s';
        },
    },
    methods: {
        toggleNav() {
            // TODO: move into store?
            this.$route.path === '/s' ?
                    this.$router.replace('/r') :
                    this.$router.replace('/s');
        },
        goToSendReload() {
            this.$router.replace('/s');
            setTimeout(() => {
                window.location.reload()
            }, 100)
        }
    },
    components: {
        Transition,
        IonPage,
        IonContent,
        IonFooter,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonLabel,
        IonButton,
        IonIcon,
        // IonRouterOutlet,
        // IonNavLink,
        RouterView,
    },
    setup() {
        return {
            SendStep,
        }
    }
})
</script>
