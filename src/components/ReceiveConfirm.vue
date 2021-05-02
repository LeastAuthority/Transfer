<template>
    <ion-page>
        <my-header></my-header>
        <ion-content :fullscreen="true">
            <ion-toolbar>
                <ion-title size="large" class="ion-text-uppercase">Receive a file</ion-title>
            </ion-toolbar>
            <ion-grid>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text v-if="!done && progress <= 0">Ready to download:</ion-text>
                        <ion-text v-else-if="!done && progress > 0">Downloading:</ion-text>
                        <ion-text v-else-if="done">Downloaded!</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text class="filename">{{ offer.name }}</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text class="size">({{ fileSize }})</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row v-show="!done">
                    <ion-col>
                        <ion-progress-bar color="primary"
                                          v-show="progress >= 0"
                                          :value="progress"
                        ></ion-progress-bar>
                    </ion-col>
                </ion-row>
                <ion-row v-if="!done">
                    <ion-col class="ion-text-center">
                        <ion-button class="download-button"
                                    color="light">
                            <ion-icon :icon="cloudDownloadOutline"></ion-icon>
                            <ion-text class="ion-padding-start"
                                      @click="download"
                            >Download
                            </ion-text>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row v-else>
                    <ion-col>
                        <ion-text class="ion-text-center">
                            <h1>
                                &#x1f389; <!-- party popper -->
                            </h1>
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row v-if="!done">
                    <ion-col class="ion-text-center">
                        <ion-button color="danger" @click="cancel()">
                            <ion-icon :icon="close"></ion-icon>
                            <ion-text class="ion-padding-start">cancel</ion-text>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row v-else class="ion-text-center">
                    <ion-col>
                        <ion-button color="light"
                                @click=sendFile()>
                            <ion-icon :icon="exitOutline"></ion-icon>
                            <ion-text class="ion-padding-start">Send a file</ion-text>
                        </ion-button>
                    </ion-col>
                    <ion-col>
                        <ion-button color="light"
                                    @click="router.push('/receive')">
                            <ion-icon :icon="enterOutline"></ion-icon>
                            <ion-text class="ion-padding-start">Receive more</ion-text>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
        <version-footer></version-footer>
    </ion-page>
</template>

<script>
    import {
        IonPage,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonButton,
        IonToolbar,
        IonTitle,
        IonIcon,
        IonProgressBar, alertController,
    } from '@ionic/vue';
    import {defineComponent} from 'vue';
    import {mapState, mapActions} from 'vuex';
    import {enterOutline, exitOutline, exit, cloudDownloadOutline, close} from 'ionicons/icons';

    import router from '@/router/index.ts'
    import MyHeader from '@/components/MyHeader.vue';
    import VersionFooter from '@/components/VersionFooter.vue';
    import {sizeToClosestUnit} from "@/util";
    import {NEW_CLIENT, SAVE_FILE} from "../store/actions";

    export default defineComponent({
        name: "ReceiveConfirm",
        computed: {
            ...mapState(['offer', 'progress', 'done']),
            fileSize() {
                return sizeToClosestUnit(this.offer.size);
            },
        },
        beforeRouteUpdate(to, from, next) {
            this.wait();
        },
        async mounted() {
            this.wait();
        },
        components: {
            IonPage,
            IonContent,
            IonGrid,
            IonRow,
            IonCol,
            IonText,
            IonButton,
            IonToolbar,
            IonTitle,
            IonIcon,
            IonProgressBar,
            MyHeader,
            VersionFooter,
        },
        methods: {
            ...mapActions([NEW_CLIENT, SAVE_FILE, 'setDone', 'setOffer', 'setProgress']),
            async wait() {
                const code = this.$route.params.code;
                try {
                    const opts = {
                        name,
                        progressFunc: this.onProgress,
                        offerCondition: (offer) => {
                            this.setOffer(offer)
                        }
                    };
                    await this[SAVE_FILE]({code, opts});
                    this.setDone(true);
                } catch (error) {
                    console.log(error);
                    await this.presentAlert(error);
                } finally {
                    this.reset();
                }
            },
            async presentAlert(error) {
                const alert = await alertController
                    .create({
                        // cssClass: 'my-custom-class',
                        header: 'Error',
                        // subHeader: 'error type',
                        message: error,
                        buttons: ['OK'],
                    });
                await alert.present();
                await alert.onWillDismiss();
                this.cancel();
            },
            async download() {
                console.log('Download clicked!');
                this.offer.accept();
            },
            onProgress(sentBytes, totalBytes) {
                this.setProgress(sentBytes / totalBytes);
            },
            cancel() {
                if (typeof (this.offer.reject) !== 'undefined') {
                    this.offer.reject();
                }
                router.push('/receive');
                this.reset();
            },
            sendFile() {
                router.push('/send?select');
                this.reset();
            },
            reset() {
                this.setProgress(-1);
            },
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
