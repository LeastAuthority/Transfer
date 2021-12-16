<template>
    <Card :active="active">
        <template #title>
            <ion-text color="dark-grey" class="bold">
                Sent!
            </ion-text>
        </template>
        <template #content>
            <ion-grid>
                <ion-row class="ion-justify-content-center ion-margin-bottom">
                    <FileCard :name="fileMeta.name"
                              :size="fileMeta.size"
                    ></FileCard>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-margin-bottom">
                        <ion-text class="ion-text-center">
                            <h1 class="party-popper">
                                &#x1f389; <!-- party popper -->
                            </h1>
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-margin-bottom">
                    <ion-col class="ion-text-center">
                        <ion-button color="blue"
                                    @click="sendMore">
                            <ion-icon slot="start" :icon="sendSharp"></ion-icon>
                            <ion-text slot="end">Send more</ion-text>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </template>
    </Card>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonRow,
    IonText
} from "@ionic/vue";
import {mapState} from "vuex";
import {sendSharp} from "ionicons/icons";

import Card from "@/components/Card.vue";
import FileCard from "@/components/FileCard.vue";

export default defineComponent({
    name: "SendComplete",
    props: ['active', 'sendMore'],
    computed: {
        ...mapState(['fileMeta']),
    },
    components: {
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        IonIcon,
        IonText,
        Card,
        FileCard,
    },
    setup() {
        return {
            sendSharp,
        };
    },
});
</script>

<style scoped>
</style>
