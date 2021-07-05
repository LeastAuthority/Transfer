<template>
    <!--    <transition name="step-fade" mode="out-in">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <ion-text color="black" class="bold">
                    Received!
                </ion-text>
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center ion-margin-bottom">
                    <FileCard :name="fileMeta.name"
                              :size="fileMeta.size"
                    ></FileCard>
                </ion-row>
                <ion-row class="ion-margin-bottom">
                    <ion-col>
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
                                    @click="next">
                            <ion-icon slot="start" src="/assets/icon/receive-more.svg"></ion-icon>
                            <ion-text slot="end">Receive more</ion-text>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </div>
    <!--    </transition>-->
</template>

<script lang="ts">
import {
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonIcon,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
} from '@ionic/vue';
import {defineComponent} from 'vue';
import {mapState} from "vuex";
import {downloadOutline, sendSharp} from 'ionicons/icons'
import {FileMeta} from "@/store";
import {sizeToClosestUnit} from "@/util";
import FileCard from "@/components/FileCard.vue";

export default defineComponent({
    name: "ReceiveComplete",
    props: ['active', 'next'],
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
        IonIcon,
        IonButton,
        FileCard,
    },
    setup() {
        return {
            downloadOutline,
            sendSharp,
        }
    },
});
</script>

<style scoped>
</style>
