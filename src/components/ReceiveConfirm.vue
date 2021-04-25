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
                        <ion-text v-if="!progress.done && progress.value <= 0">Ready to download:</ion-text>
                        <ion-text v-else-if="!progress.done && progress.value > 0">Downloading:</ion-text>
                        <ion-text v-else-if="progress.done">Downloaded!</ion-text>
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
                <ion-row v-show="!progress.done">
                    <ion-col>
                        <ion-progress-bar color="primary"
                                          v-show="progress.value >= 0"
                                          :value="progress.value"
                        ></ion-progress-bar>
                    </ion-col>
                </ion-row>
                <ion-row v-if="!progress.done">
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
                <ion-row v-if="!progress.done">
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
    import ClientWorker from '@/go/wormhole/client_worker.ts';
    import {sizeToClosestUnit} from "@/util";

    export default defineComponent({
        name: "ReceiveConfirm",
        data() {
            // NB: state proxy can't be cloned.
            const config = Object.assign({},this.$store.state.config);

            return {
                client: new ClientWorker(config),
            }
        },
        computed: {
            ...mapState('receive', ['offer', 'progress']),
            fileSize() {
                return sizeToClosestUnit(this.offer.size);
            },
        },
        async mounted() {
            const code = this.$route.params.code;
            try {
                await this.client.saveFile(code, {
                    name,
                    progressFunc: this.onProgress,
                    offerCondition: this.offerCondition,
                });
                this.setDone(true);
            } catch (error) {
                console.log(error);
                await this.presentAlert(error);
            }
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
            ...mapActions('receive', ['setOffer', 'setProgress', 'setDone']),
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
            offerCondition(offer) {
                this.setOffer(offer);
            },
            cancel() {
                if (typeof (this.offer.reject) !== 'undefined') {
                    this.offer.reject();
                }
                router.push('/receive');
            },
            sendFile() {
                router.push('/send?select');
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
