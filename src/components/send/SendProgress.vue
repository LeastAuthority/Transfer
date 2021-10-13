<template>
    <!--    <transition name="step-fade" mode="out-in">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <ion-text class="bold" color="dark-grey">
                    Sending...
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
                <ion-row class="ion-justify-content-center ion-align-items-center">
                    <ion-col>
                        <ion-progress-bar color="progress-grey"
                                          :value="progress"
                        ></ion-progress-bar>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center">
                    <ion-col>
                        <ion-text color="dark-grey">
                            {{ _progressETA }}
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center">
                    <ion-col>
                        <ion-button color="medium-grey"
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
import {mapGetters, mapMutations, mapState} from "vuex";
import {RESET_PROGRESS} from "@/store/actions";
import {close} from 'ionicons/icons'
import FileCard from "@/components/FileCard.vue";

export default defineComponent({
    name: "SendProgress.vue",
    props: ['active', 'back'],
    computed: {
        ...mapState(['progress', 'fileMeta']),
        ...mapGetters(['progressETA']),
        _progressETA() {
            return (this.progressETA as unknown as string) !== '' ?
                    this.progressETA :
                    'Waiting for receiver to complete transfer...';
        },
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
        IonText,
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
