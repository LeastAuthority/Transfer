<template>
    <!--    <transition name="step-fade" mode="out-in">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <ion-text color="black">
                    Sending...
                </ion-text>
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <FileCard :filename="fileMeta.name"></FileCard>
                </ion-row>
                <ion-row class="ion-justify-content-center ion-align-items-center">
                    <ion-col>
                        <ion-progress-bar color="black"
                                          :value="progress"
                        ></ion-progress-bar>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center">
                    <ion-col>
                        {{ progressETASeconds }} sec. remaining
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center">
                    <ion-col>
                        <ion-button color="dark-grey"
                                    @click="cancel"
                        >
                            <ion-icon slot="start" :icon="close"></ion-icon>
                            <ion-label slot="end">Cancel</ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </div>
    <!--    </transition>-->
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
    IonLabel,
    IonProgressBar,
    IonRow,
    IonText
} from "@ionic/vue";
import {mapMutations, mapState} from "vuex";
import {RESET_PROGRESS} from "@/store/actions";
import {close} from 'ionicons/icons'
import FileCard from "@/components/FileCard.vue";

export default defineComponent({
    name: "SendProgress.vue",
    props: ['active', 'back'],
    computed: {
        ...mapState(['progress', 'fileMeta', 'progressETASeconds']),
    },
    methods: {
        ...mapMutations([RESET_PROGRESS]),
        // TODO: lift up.
        cancel() {
            this.back();
            this[RESET_PROGRESS]();
        },
    },
    components: {
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        IonLabel,
        IonIcon,
        IonProgressBar,
        FileCard,
    },
    setup() {
        return {
            close,
        };
    }
})
</script>

<style scoped>
</style>
