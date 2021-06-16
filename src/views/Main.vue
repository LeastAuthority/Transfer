<template>
    <ion-page>
        <ion-content>
            <ion-grid>
                <div class="bg">
                    <div class="bg-circle"></div>
                </div>
                <!--                TODO: use ion- classes instead of style attr. -->
                <ion-row class="header" style="align-items: flex-end">
                    <ion-col size="6">
                        <ion-text>
                            <h1 class="ion-padding-start">
                                winden
                            </h1>
                        </ion-text>
                    </ion-col>
                    <ion-col size="6" align="right">
                        <ion-button color="light-grey"
                                    class="ion-margin-end nav-button"
                                    @click="toggleNav()">
                            <!--                            <ion-icon class="dark-label-icon" :icon="navIcon"></ion-icon>-->
                            <ion-icon slot="start" :rotate="rotated"
                                      src="/assets/icon/download.svg"></ion-icon>
                            <ion-label slot="end">
                                {{ navButtonText }}
                            </ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <router-view v-slot="{ Component, route }">
                            <transition :name="route.meta.transition" mode="out-int">
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
                <ion-row style="justify-content: flex-end; text-align: center">
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

<style scoped>
.ion-page {
    align-items: center;
}

ion-footer {
    background: transparent;
    font-size: 16px;
    font-weight: 600;
}

ion-content {
    /* TODO: use css variables! */
    max-width: 1100px;
    /* min-height: 730px; */
    min-height: 33vh;
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

.bg {
    z-index: -100;
    overflow: hidden;
    position: relative;
    height: 100%;
    width: 100%;
}

.bg-circle {
    position: relative;
    clip-path: circle(50%);
    top: 25vh;
    left: -10vw;
    height: 100%;
    width: 100%;
    background: #9EE6F5;
}
</style>

<style>
.dark-label-icon {
    color: black;
    padding-right: 5px;
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
            // Component,
        }
    }
})
</script>
