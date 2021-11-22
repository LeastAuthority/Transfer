<template>
    <Card :active="active">
        <template #title>
            <ion-text color="dark-grey" class="bold">
                Ready to download
            </ion-text>
        </template>
        <template #content>
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
        </template>
    </Card>
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
    IonLabel,
} from '@ionic/vue';
import {defineComponent} from 'vue';
import {mapState, mapActions, mapMutations} from 'vuex';
import {enterOutline, exitOutline, exit, cloudDownloadOutline, close} from 'ionicons/icons';

import router from '@/router/index.ts'
import {
    ACCEPT_FILE,
    ALERT_MATCHED_ERROR,
    RESET_CODE,
    RESET_PROGRESS,
    SET_PROGRESS
} from "@/store/actions";
import {TransferProgress} from "@/go/wormhole/types";
import Card from "@/components/Card.vue";
import FileCard from "@/components/FileCard.vue";

declare interface ReceiveConsentData {
    receivingPromise?: Promise<TransferProgress>;
}

export default defineComponent({
    name: "ReceiveConsent",
    props: ['active', 'back', 'next', 'complete', 'reset'],
    data(): ReceiveConsentData {
        return {
            receivingPromise: undefined,
        }
    },
    computed: {
        ...mapState(['config', 'code', 'fileMeta', 'progress']),
    },
    methods: {
        ...mapActions([ACCEPT_FILE, ALERT_MATCHED_ERROR]),
        ...mapMutations([SET_PROGRESS, RESET_CODE, RESET_PROGRESS]),
        async download() {
            this.next();
            try {
                await this[ACCEPT_FILE]();
            } catch {
                this[RESET_CODE]();
                this.reset();
            }
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
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonButton,
        IonIcon,
        IonLabel,
        IonProgressBar,
        Card,
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
