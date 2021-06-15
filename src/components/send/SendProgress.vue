<template>
<!--    <transition name="step-fade" mode="out-in">-->
        <div v-show="active">
            <ion-card-header>
                <ion-card-title>
                    <!--            {{title}}-->
                    Sending...
                </ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-grid>
                    <ion-row class="ion-justify-content-center ion-align-items-center">
                        <ion-col class="ion-text-center">
                            <!--                            "wild cat card"-->
                            <ion-text class="bold">
                                {{ fileMeta.name }}
                            </ion-text>
                            <!--                            <ion-text>-->
                            <!--                                ({{ fileSize }})-->
                            <!--                            </ion-text>-->
                        </ion-col>
                    </ion-row>
                    <ion-row class="ion-justify-content-center ion-align-items-center">
                        <ion-col>
                            <ion-progress-bar color="medium"
                                              :value="progress"
                            ></ion-progress-bar>
                        </ion-col>
                    </ion-row>
                    <ion-row class="ion-text-center">
                        <ion-col>
                            {{ timeRemaining }}
                        </ion-col>
                    </ion-row>
                    <ion-row class="ion-text-center">
                        <ion-col>
                            <ion-button color="grey"
                                        @click="cancel"
                            >
                                <ion-icon :icon="close"></ion-icon>
                                <ion-label>Cancel</ion-label>
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
import {mapActions, mapState} from "vuex";
import {RESET_PROGRESS} from "@/store/actions";

export default defineComponent({
    name: "SendProgress.vue",
    props: ['active', 'back'],
    computed: {
        ...mapState(['progress', 'fileMeta']),
        // TODO: calculate!
        timeRemaining(): string {
            return "4 sec. remaining";
        },
    },
    methods: {
        ...mapActions([RESET_PROGRESS]),
        // TODO: move up to Send.vue
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
        IonText,
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
