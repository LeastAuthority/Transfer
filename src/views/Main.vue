<template>
    <ion-page>
        <div class="bg">
            <div class="bg-circle"></div>
        </div>
        <ion-content>
            <ion-grid>
                <ion-row class="header ion-align-items-end">
                    <ion-col size="6">
                        <ion-text color="black"
                                  class="pointer"
                                  @click="goToSendReload">
                            <h1 class="ion-no-margin ion-padding-start">
                                Transfer
                            </h1>
                        </ion-text>
                    </ion-col>
                    <ion-col size="6" class="flex ion-justify-content-end">
                        <ion-button color="medium-grey"
                                    class="ion-margin-end nav-button"
                                    @click="toggleNav()">
                            <ion-icon slot="start" :rotate="rotated"
                                      src="/assets/icon/download.svg"></ion-icon>
                            <ion-label class="ion-text-uppercase" slot="end">
                                {{ navButtonText }}
                            </ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
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
            <ion-grid>
                <!--                TODO: use ion- classes instead of style attr. -->
                <ion-row class="ion-justify-content-center ion-justify-content-end ion-text-center">
                    <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                        <ion-text color="dark-grey">
                            Security
                        </ion-text>
                    </ion-col>
                    <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                        <ion-text color="dark-grey">
                            Privacy
                        </ion-text>
                    </ion-col>
                    <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                        <ion-text color="dark-grey">
                            About Us
                        </ion-text>
                    </ion-col>
                    <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                        <ion-text color="dark-grey">
                            GitHub
                        </ion-text>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-footer>
    </ion-page>
</template>

<style lang="css">
ion-card-title {
    font-size: 20px;
}

ion-card-subtitle {
    font-size: 14px;
}

ion-card-content p ion-text {
    font-size: 14px;
    font-weight: 500;
}

:root {
    --max-width: 1100px;
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

.header h1 {
    font-size: 36px;
}

/*
ion-icon.nav {
    transition: transform .3s ease;
} */

.nav-button ion-icon[rotate=true] {
    transform: rotate(-90deg);
}

.pointer {
    cursor: pointer;
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
        top: 5vw;
        left: -48vw;
        width: 170vw;
        height: 103vh;
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
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonLabel,
    IonPage,
    IonRouterOutlet,
    IonNavLink,
    IonRow,
    IonText, IonFooter
} from "@ionic/vue";
import {arrowDownSharp, arrowForwardSharp, sendSharp} from 'ionicons/icons';
import Send from "@/views/Send.vue";
import Receive from "@/views/Receive.vue";
import {RouterView} from "vue-router";
import {SendStep} from "@/types";

export default defineComponent({
    computed: {
        navComponent(): Component {
            return this.$route.path === '/s' ? Send : Receive;
        },
        navDirection(): string {
            return this.$route.path === '/s' ? 'forward' : 'back';
        },
        navButtonText(): string {
            return this.$route.path === '/s' ? 'Receive' : 'Send';
        },
        navHref(): string {
            return this.$route.path === '/s' ? '/r' : '/s';
        },
        rotated(): boolean {
            console.log(this.$route.path !== '/s');
            return this.$route.path !== '/s';
        },
    },
    methods: {
        toggleNav() {
            // TODO: move into store?
            console.log(this.$route.path)
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
            window,
        }
    }
})
</script>
