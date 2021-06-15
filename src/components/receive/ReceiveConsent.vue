<template>
    <transition name="step-fade" mode="out-in">
        <div>
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
    </transition>
    <!--    <ion-page>-->
    <!--        <my-header></my-header>-->
    <!--        <ion-content :fullscreen="true">-->
    <!--            <ion-toolbar>-->
    <!--                <ion-title size="large" class="ion-text-uppercase">Receive a file</ion-title>-->
    <!--            </ion-toolbar>-->
    <!--            <ion-grid>-->
    <!--                <ion-row>-->
    <!--                    <ion-col class="ion-text-center">-->
    <!--                        <ion-text v-if="!done && progress <= 0">Ready to download:</ion-text>-->
    <!--                        <ion-text v-else-if="!done && progress > 0">Downloading:</ion-text>-->
    <!--                        <ion-text v-else-if="done">Downloaded!</ion-text>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row>-->
    <!--                    <ion-col class="ion-text-center">-->
    <!--                        <ion-text class="filename">{{ fileMeta.name }}</ion-text>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row>-->
    <!--                    <ion-col class="ion-text-center">-->
    <!--                        <ion-text class="size">({{ fileSize }})</ion-text>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row v-show="!done">-->
    <!--                    <ion-col>-->
    <!--                        <ion-progress-bar color="primary"-->
    <!--                                          v-show="progress >= 0"-->
    <!--                                          :value="progress"-->
    <!--                        ></ion-progress-bar>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row v-if="!done">-->
    <!--                    <ion-col class="ion-text-center">-->
    <!--                        <ion-button class="download-button"-->
    <!--                                    color="light"-->
    <!--                                    @click="download">-->
    <!--                            <ion-icon :icon="cloudDownloadOutline"></ion-icon>-->
    <!--                            <ion-text class="ion-padding-start">-->
    <!--                                Download-->
    <!--                            </ion-text>-->
    <!--                        </ion-button>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row v-else>-->
    <!--                    <ion-col>-->
    <!--                        <ion-text class="ion-text-center">-->
    <!--                            <h1>-->
    <!--                                &#x1f389; &lt;!&ndash; party popper &ndash;&gt;-->
    <!--                            </h1>-->
    <!--                        </ion-text>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row v-if="!done">-->
    <!--                    <ion-col class="ion-text-center">-->
    <!--                        <ion-button color="danger" @click="cancel()">-->
    <!--                            <ion-icon :icon="close"></ion-icon>-->
    <!--                            <ion-text class="ion-padding-start">cancel</ion-text>-->
    <!--                        </ion-button>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row v-else class="ion-text-center">-->
    <!--                    <ion-col>-->
    <!--                        <ion-button color="light"-->
    <!--                                @click=sendFile()>-->
    <!--                            <ion-icon :icon="exitOutline"></ion-icon>-->
    <!--                            <ion-text class="ion-padding-start">Send a file</ion-text>-->
    <!--                        </ion-button>-->
    <!--                    </ion-col>-->
    <!--                    <ion-col>-->
    <!--                        <ion-button color="light"-->
    <!--                                    @click="router.push('/r')">-->
    <!--                            <ion-icon :icon="enterOutline"></ion-icon>-->
    <!--                            <ion-text class="ion-padding-start">Receive more</ion-text>-->
    <!--                        </ion-button>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--            </ion-grid>-->
    <!--        </ion-content>-->
    <!--        <version-footer></version-footer>-->
    <!--    </ion-page>-->
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
// import VersionFooter from '@/components/VersionFooter.vue';
import {sizeToClosestUnit} from "@/util";
import {NEW_CLIENT, RESET_CODE, RESET_PROGRESS, SAVE_FILE, SET_CODE, SET_PROGRESS} from "@/store/actions";
import {FileMeta} from "@/store";

const alertOpts = {
    buttons: ['OK'],
};

declare interface ReceiveConsentData {
    accept?: () => void;
}

export default defineComponent({
    name: "ReceiveConsent",
    props: ['back', 'next'],
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
    // beforeRouteUpdate(to, from, next) {
    //     this.wait();
    // },
    async mounted() {
        await this.wait();
    },
    methods: {
        ...mapActions([NEW_CLIENT, SAVE_FILE, 'alert', 'setDone']),
        ...mapMutations([SET_PROGRESS, RESET_CODE, RESET_PROGRESS]),
        async wait() {
            try {
                const opts = {
                    progressFunc: this.onProgress,
                };
                // TODO: this[SAVE_FILE] return should incl. a cancel and/or reject func.*
                const {accept, done} = await this[SAVE_FILE]({code: this.code, opts});
                this.accept = accept;
                done.then(() => {
                    this.next();
                    this[RESET_CODE]();
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
            console.log('Download clicked!');
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
