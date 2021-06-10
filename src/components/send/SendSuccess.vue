<template>
    <ion-grid>
        <ion-row>
            <ion-col class="ion-text-center">
                <ion-text>Sent!</ion-text>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col class="ion-text-center">
                <ion-text class="filename">{{ file.name }}</ion-text>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col class="ion-text-center">
                <ion-text class="size">({{ fileSize() }})</ion-text>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col>
                <ion-text class="ion-text-center">
                    <h1>
                        &#x1f389; <!-- party popper -->
                    </h1>
                </ion-text>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col class="ion-text-center">
                <ion-button color="light"
                            @click="sendMore()">
                    <ion-icon :icon="add"></ion-icon>
                    <ion-text class="ion-padding-start">Send more</ion-text>
                </ion-button>
            </ion-col>
        </ion-row>
    </ion-grid>
</template>

<script>
import {defineComponent} from "vue";
import {IonButton, IonCol, IonGrid, IonIcon, IonRow, IonText} from "@ionic/vue";

export default defineComponent({
    name: "SendSuccess",
    props: ['sendMore'],
    components: {
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        IonIcon,
        IonText,
    }
});
</script>

<style scoped>

</style>
