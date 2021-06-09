<template>
    <ion-page>
        <ion-content style="--padding:10px;">
            <ion-grid>
                <div class="bg">
                    <div class="bg-circle"></div>
                </div>
                <ion-row style="align-items: flex-end">
                    <ion-col size="6">
                        <h1 class="header-big">
                            <ion-text>
                                winden
                            </ion-text>
                        </h1>
                    </ion-col>
                    <ion-col size="6" align="right">
                        <ion-button color="medium">
                            <ion-icon class="dark-label-icon" :icon="arrowDownSharp"></ion-icon>
                            <ion-label color="dark">
                                Receive
                            </ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-router-outlet></ion-router-outlet>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
        <ion-footer class="ion-no-border">
            <ion-grid>
                <ion-row style="justify-content: flex-end; text-align: center">
                    <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                        Security
                    </ion-col>
                    <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                        Privacy
                    </ion-col>
                    <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                        About Us
                    </ion-col>
                    <ion-col sizeLg="1" sizeMd="2" sizeSm="2" sizeXs="3">
                        GitHub
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-footer>
    </ion-page>
</template>

<style scoped>
ion-router-outlet {
    position: relative;
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

import {defineComponent} from "vue";
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid, IonIcon, IonLabel,
    IonPage,
    IonRouterOutlet,
    IonRow, IonText
} from "@ionic/vue";
import {arrowDownSharp} from 'ionicons/icons';

export default defineComponent({
    components: {
        IonPage,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        // IonCard,
        // IonCardHeader,
        // IonCardTitle,
        // IonCardSubtitle,
        // IonCardContent,
        IonText,
        IonLabel,
        IonButton,
        IonIcon,
        IonRouterOutlet,
    },
    setup() {
        return {
            arrowDownSharp,
        }
    }
})
</script>
