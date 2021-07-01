<template>
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <ion-text color="dark-grey" class="bold">
                    Sent!
                </ion-text>
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <FileCard :name="fileMeta.name"
                              :size="fileMeta.size"
                    ></FileCard>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-text class="ion-text-center">
                            <h1 class="party-popper">
                                &#x1f389; <!-- party popper -->
                            </h1>
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-button color="medium-grey"
                                    class="large-button"
                                    @click="sendMore">
                            <ion-icon slot="icon-only" src="/assets/icon/send-more.svg"></ion-icon>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonIcon,
    IonRow,
    IonText
} from "@ionic/vue";
import {mapState} from "vuex";
import {add} from "ionicons/icons";
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
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
        FileCard,
    },
});
</script>

<style scoped>
</style>
