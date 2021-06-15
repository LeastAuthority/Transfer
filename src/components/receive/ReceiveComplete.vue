<template>
    <ion-card-header>
        <ion-card-title>
            <!--            {{title}}-->
            Received!
        </ion-card-title>
    </ion-card-header>
    <ion-card-content>
        <ion-grid>
            <ion-row>
                <ion-col class="ion-text-center">
                    <ion-text>Receive Success!</ion-text>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col class="ion-text-center">
                    <ion-text class="filename">{{ fileMeta.name }}</ion-text>
                </ion-col>
            </ion-row>
            <!--                <ion-row>-->
            <!--                    <ion-col class="ion-text-center">-->
            <!--                        <ion-text class="size">({{ fileSize }})</ion-text>-->
            <!--                    </ion-col>-->
            <!--                </ion-row>-->
        </ion-grid>
    </ion-card-content>
</template>

<script lang="ts">
import {
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    // IonButton,
    // IonIcon,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
} from '@ionic/vue';
import {defineComponent} from 'vue';
import {mapState} from "vuex";

export default defineComponent({
    name: "ReceiveComplete",
    props: ['next'],
    computed: {
        ...mapState(['fileMeta']),
    },
    components: {
        IonCardContent,
        IonCardHeader,
        IonCardTitle,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        // IonIcon,
        // IonButton,
    },
});
</script>

<style scoped>

</style>
