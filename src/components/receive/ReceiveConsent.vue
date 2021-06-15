<template>
    <!--    <transition name="step-fade" mode="out-in">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <!--            {{title}}-->
                Ready to download
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center ion-align-items-center">
                    <ion-col class="ion-text-end">
                        <ion-text class="bold">
                            {{ fileMeta.name }}
                        </ion-text>
                        <ion-text>
                            ({{ fileSize }})
                        </ion-text>
                    </ion-col>
                    <ion-col>
                        <ion-button color="yellow"
                                    @click="download"
                        >
                            <ion-icon src="/assets/icon/download.svg"></ion-icon>
                            <ion-label>Download</ion-label>
                        </ion-button>
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
import {ACCEPT_FILE, NEW_CLIENT, RESET_CODE, RESET_PROGRESS, SAVE_FILE, SET_CODE, SET_PROGRESS} from "@/store/actions";
import {FileMeta} from "@/store";

declare interface ReceiveConsentData {
    done?: Promise<void>;
}

export default defineComponent({
    name: "ReceiveConsent",
    props: ['active', 'back', 'next'],
    data(): ReceiveConsentData {
        return {
            done: undefined,
        }
    },
    computed: {
        ...mapState(['config', 'code', 'fileMeta', 'progress']),
        fileSize() {
            // TODO: cleanup.
            const fileMeta = this.fileMeta as unknown as FileMeta;
            return sizeToClosestUnit(fileMeta.size);
        },
        // TODO: calculate!
        timeRemaining(): string {
            return "4 sec. remaining";
        },
    },
    async beforeUpdate() {
        await this.saveFileOnce();
    },
    methods: {
        ...mapActions([NEW_CLIENT, SAVE_FILE, ACCEPT_FILE, 'alert']),
        ...mapMutations([SET_PROGRESS, RESET_CODE, RESET_PROGRESS]),
        async saveFileOnce(): Promise<void> {
            if (this.active && typeof (this.done) === 'undefined' &&
                    typeof (this.fileMeta.done) === 'undefined') {
                try {
                    this.done = this[SAVE_FILE](this.code);
                    await this.done.then(() => {
                        this.done = undefined;
                    });
                    this.next();
                } catch (error) {
                    await this.alert({error});
                    this.cancel();
                }
            }
        },
        async download() {
            console.log('Download clicked!');
            this[ACCEPT_FILE]();
            // TODO: cleanup.
            // try {
            //     if (typeof(this.accept) !== 'function') {
            //         throw new Error('accept is not a function')
            //     }
            //     await this.accept!();
            // } catch (error) {
            //     this.alert({error, opts: alertOpts})
            // }
        },
        cancel() {
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
        //VersionFooter,
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
