<template>
<!--    <ion-page>-->
<!--        <my-header></my-header>-->
<!--        <ion-content :fullscreen="true">-->
<!--            <ion-toolbar>-->
<!--                <ion-title size="large" class="ion-text-uppercase">Receive Success!</ion-title>-->
<!--            </ion-toolbar>-->
            <ion-grid>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text>Receive Success!</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text class="filename">{{ file.name }}</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text class="size">({{ fileSize }})</ion-text>
                    </ion-col>
                </ion-row>
            </ion-grid>
<!--        </ion-content>-->
<!--    </ion-page>-->
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
    import {defineComponent} from 'vue';

    import MyHeader from "../MyHeader";

    export default defineComponent({
        name: "ReceiveSuccess",
        components: [
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
        ]
    });
</script>

<style scoped>

</style>
