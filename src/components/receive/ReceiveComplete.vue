<template>
    <!--    <transition name="step-fade" mode="out-in">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <ion-text color="dark-grey" class="bold">
                    Received!
                </ion-text>
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text color="black" class="bold">
                            {{ fileMeta.name }}
                        </ion-text>
                        <ion-text color="black" class="size">
                            ({{ fileSize }})
                        </ion-text>
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
                        <ion-button color="medium-grey"
                                    @click="next">
                            <ion-icon :icon="downloadOutline"></ion-icon>
                            <ion-text class="ion-padding-start">receive more</ion-text>
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
import {downloadOutline} from 'ionicons/icons'
import {FileMeta} from "@/store";
import {sizeToClosestUnit} from "@/util";

export default defineComponent({
    name: "ReceiveComplete",
    props: ['active', 'next'],
    computed: {
        ...mapState(['fileMeta']),
        fileSize() {
            // TODO: cleanup.
            const fileMeta = this.fileMeta as unknown as FileMeta;
            return sizeToClosestUnit(fileMeta.size);
        },
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
    },
    setup() {
        return {
            downloadOutline,
        }
    },
});
</script>

<style scoped>
.size {
    font-size: small;
    padding-left: 6px;
}
</style>
