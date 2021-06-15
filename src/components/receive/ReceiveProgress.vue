<template>
<!--    <transition name="step-fade" mode="out-in">-->
        <div v-show="active">
            <ion-card-header>
                <ion-card-title>
                    <!--            {{title}}-->
                    Receiving...
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
                            <ion-button color="light-yellow">
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
                            {{timeRemaining}}
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
    IonCardContent, IonCardHeader, IonCardTitle,
} from '@ionic/vue';
import {defineComponent} from 'vue';
import {mapState, mapActions, mapMutations} from 'vuex';
import {enterOutline, exitOutline, exit, cloudDownloadOutline, close} from 'ionicons/icons';

import router from '@/router/index.ts'
import {sizeToClosestUnit} from "@/util";
import {NEW_CLIENT, RESET_PROGRESS, SAVE_FILE, SET_PROGRESS} from "@/store/actions";
import {FileMeta} from "@/store";

const alertOpts = {
    buttons: ['OK'],
};

declare interface ReceiveConsentData {
    accept?: () => void;
}

export default defineComponent({
    name: "ReceiveConsent",
    props: ['active', 'back', 'next'],
    data(): ReceiveConsentData {
      return {
          accept: undefined,
      }
    },
    computed: {
        ...mapState(['config', 'code', 'fileMeta', 'progress', 'done']),
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
    async mounted() {
        await this.wait();
    },
    methods: {
        ...mapActions([NEW_CLIENT, SAVE_FILE, 'alert']),
        ...mapMutations([SET_PROGRESS, RESET_PROGRESS]),
        async wait() {
            // const code = this.$route.params.code;
            try {
                const opts = {
                    // name,
                    progressFunc: this.onProgress,
                    // offerCondition: (offer) => {
                    //     this.setOffer(offer)
                    // }
                };
                console.log(this.code);
                // TODO: this[SAVE_FILE] should return a cancel func and done promise.
                const {accept, done} = await this[SAVE_FILE]({code: this.code, opts});
                this.accept = accept;
                // this.cancelSave = cancel;
                done.then(() => {
                    this.next();
                    this[RESET_PROGRESS]();
                }).catch(async (error: string) => {
                    await this.alert({error, opts: alertOpts});
                    this.cancel();
                })
            } catch (error) {
                console.log(error);
                await this.alert({error, opts: alertOpts});
                this.cancel();
            }
        },
        async download() {
            // TODO: cleanup.
            try {
                if (typeof(this.accept) !== 'function') {
                    throw new Error('accept is not a function')
                }
                await this.accept!();
            } catch (error) {
                this.alert({error, opts: alertOpts})
            }
        },
        onProgress(sentBytes: number, totalBytes: number) {
            this[SET_PROGRESS](sentBytes / totalBytes);
        },
        cancel() {
            // TODO: where did reject go?
            // if (typeof (this.offer && this.offer.reject) !== 'undefined') {
            //     this.offer.reject();
            // }

            // TODO: move up to Receive.vue>
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
.size {
    font-size: small;
}

.filename {
    font-weight: bold;
}
</style>
