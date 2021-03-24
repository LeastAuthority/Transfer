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
                        <ion-text>Ready to download:</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text class="filename">{{ file.name }}</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text class="size">({{ fileSize }})</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-progress-bar color="primary"
                                          v-show="progress.value >= 0"
                                          :type="progress.type"
                                          :value="progress.value"
                        ></ion-progress-bar>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-button class="download-button"
                                    color="light"
                                    :disabled="!file.ready">
                            <ion-icon :icon="cloudDownloadOutline"></ion-icon>
                            <ion-text class="ion-padding-start"
                                      @click="download"
                            >Download
                            </ion-text>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-button color="danger" @click="router.push('/receive')">
                            <ion-icon :icon="close"></ion-icon>
                            <ion-text class="ion-padding-start">cancel</ion-text>
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
        IonProgressBar,
    } from '@ionic/vue';
    import {defineComponent} from 'vue';
    import {cloudDownloadOutline, close} from 'ionicons/icons';
    import streamSaver from 'streamsaver';

    import router from '@/router/index.ts'
    import MyHeader from '@/components/MyHeader.vue';
    import VersionFooter from '@/components/VersionFooter.vue';
    import ClientWorker from '@/go/wormhole/client_worker.ts';
    import {sizeToClosestUnit} from "@/util";

    // TODO: move
    function decodeFileInfo(infoStr) {
        return JSON.parse(window.atob(infoStr))
    }

    // TODO: refactor
    const PROGRESS_INDETERMINATE = 'indeterminate'
    const PROGRESS_DETERMINATE = 'determinate'
    const PROGRESS_DONE_TIMEOUT_MS = 500;

    export default defineComponent({
        name: "ReceiveConfirm",
        data() {
            return {
                client: new ClientWorker(),
                file: {
                    name: '',
                    size: 0,
                    code: '',
                    ready: false,
                },
                progress: {
                    type: PROGRESS_INDETERMINATE,
                    // type: PROGRESS_DETERMINATE,
                    value: -1,
                    _value: -1,
                    doneID: -1,
                    updateID: -1,
                }
            }
        },
        computed: {
            fileSize() {
                return sizeToClosestUnit(this.file.size);
            }
        },
        async mounted() {
            // TODO: expose more of wormhole-william and handle this internally!
            const fileInfoStr = await this.client.recvText(this.$route.params.code);
            const {name, size, fileCode: code} = decodeFileInfo(fileInfoStr);
            this.file = {name, size, code, ready: true};
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
            // TODO: move this to Receive.vue
            async download() {
                const {name, size} = this.file;
                await this.client.saveFile(this.file.code, {
                    name, size,
                    progressFunc: this.onProgress,
                });
            },
            // TODO: refactor
            onProgress(sentBytes, totalBytes) {
                if (this.progress.type === PROGRESS_INDETERMINATE) {
                    this.progress.type = PROGRESS_DETERMINATE;
                }
                this.progress.value = sentBytes / totalBytes;

                if (this.progress.doneID > 0) {
                    window.clearTimeout(this.progress.doneID);
                }
                this.progress.doneID = window.setTimeout(this.resetProgress, PROGRESS_DONE_TIMEOUT_MS);
            },
        },
        setup() {
            return {
                cloudDownloadOutline,
                close,
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
