<template>
    <!--    <transition name="step-fade" mode="out-in">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <ion-text color="dark-grey" class="bold">
                    Ready to download
                </ion-text>
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center ion-margin-top">
                    <FileCard :name="fileMeta.name"
                              :size="fileMeta.size"
                    ></FileCard>
                </ion-row>
                <ion-row class="ion-justify-content-center ion-align-items-center">
                    <ion-col class="ion-text-center">
                        <ion-button class="download-button"
                                    color="yellow"
                                    @click="download"
                        >
                            <ion-icon slot="start" src="/assets/icon/download.svg"></ion-icon>
                            <ion-label slot="end">Download</ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-justify-content-center ion-align-items-center">
                    <ion-col>
                        <!--  TODO: something better.-->
                        <!--NB: should never see this but takes up the right amount of space-->
                        <ion-progress-bar style="opacity: 0;"
                        ></ion-progress-bar>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center">
                    <ion-col>
                        <!--  TODO: something better.-->
                        <!--NB: should never see this but takes up the right amount of space-->
                        <ion-text style="opacity: 0;">
                            waiting for sender...
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
import {
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonIcon,
    IonProgressBar,
    IonCardContent, IonCardHeader, IonCardTitle, IonLabel,
} from '@ionic/vue';
import {defineComponent} from 'vue';
import {mapState, mapActions, mapMutations} from 'vuex';
import {enterOutline, exitOutline, exit, cloudDownloadOutline, close} from 'ionicons/icons';

import router from '@/router/index.ts'
import {sizeToClosestUnit} from "@/util";
import {
    ACCEPT_FILE,
    ALERT,
    NEW_CLIENT,
    RESET_CODE,
    RESET_PROGRESS,
    SAVE_FILE,
    SET_CODE,
    SET_PROGRESS
} from "@/store/actions";
import {FileMeta} from "@/store";
import {TransferProgress} from "@/go/wormhole/types";
import FileCard from "@/components/FileCard.vue";

declare interface ReceiveConsentData {
    receivingPromise?: Promise<TransferProgress>;
}

export default defineComponent({
    name: "ReceiveConsent",
    props: ['active', 'back', 'next', 'complete'],
    async beforeUpdate() {
        // await this.saveFileOnce();
    },
    data(): ReceiveConsentData {
        return {
            receivingPromise: undefined,
        }
    },
    computed: {
        ...mapState(['config', 'code', 'fileMeta', 'progress']),
    },
    methods: {
        ...mapActions([ACCEPT_FILE, ALERT]),
        ...mapMutations([SET_PROGRESS, RESET_CODE, RESET_PROGRESS]),
        async download() {
            this.next();
            this[ACCEPT_FILE]();
            await this.fileMeta.done
            this.complete();
        },
        cancel() {
            // TODO: move into action.
            // TODO: *use reject here.
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
        IonIcon,
        IonLabel,
        IonProgressBar,
        FileCard,
    },
    setup() {
        return {
            cloudDownloadOutline,
            close,
            enterOutline,
            exit,
            exitOutline,
            router,
        }
    }
});
</script>

<style lang="css" scoped>
</style>
