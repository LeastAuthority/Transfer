<template>
    <ion-page>
        <my-header></my-header>
        <ion-content :fullscreen="true">
            <ion-toolbar>
                <ion-title size="large" class="ion-text-uppercase">Receive a file</ion-title>
            </ion-toolbar>
        </ion-content>
        <ion-grid>
            <ion-row>
                <ion-col class="ion-text-center">
                    <ion-text>Ready to download:</ion-text>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col class="ion-text-center">
                    <ion-text class="filename">Filename.ext</ion-text>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col class="ion-text-center">
                    <ion-text class="size">(900 MB)</ion-text>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <ion-button color="light">
                        <ion-icon :icon="cloudDownloadOutline"></ion-icon>
                        <ion-text class="ion-padding-start">Download</ion-text>
                    </ion-button>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col class="ion-text-center">
                    <ion-button color="danger" @click="router.push('/receive')">
                        <ion-icon :icon="close"></ion-icon>
                        <ion-text class="ion-padding-start">cancel</ion-text>
                    </ion-button>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-page>
</template>

<script>
    import {
        IonPage,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonButton,
        IonToolbar,
        IonTitle,
        IonIcon,
    } from '@ionic/vue';
    import {cloudDownloadOutline, close} from 'ionicons/icons';

    import router from '@/router/index.ts'
    import MyHeader from '@/components/MyHeader.vue';

    export default {
        name: "ReceiveConfirm",
        components: {
            IonPage,
            IonContent,
            IonGrid,
            IonRow,
            IonCol,
            IonText,
            IonButton,
            IonToolbar,
            IonTitle,
            IonIcon,
            MyHeader,
        },
        setup() {
            return {
                cloudDownloadOutline,
                close,
                router,
            }
        }
    }
</script>

<style lang="css" scoped>
    .size {
        font-size: small;
    }
    .filename {
        font-weight: bold;
    }
</style>