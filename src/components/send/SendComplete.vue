<template>
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <!--            {{title}}-->
                Sent!
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <FileCard :filename="fileMeta.name"></FileCard>
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
                        <ion-button color="light-grey"
                                    class="send-more-button"
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
.send-more-button {
    width: 135px;
    height: 135px;
}

.send-more-button ion-icon {
    font-size: 140px;
    position: absolute;
    top: 0;
    padding: 0;
    margin: auto;
}
</style>
