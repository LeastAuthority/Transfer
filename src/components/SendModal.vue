<template>
    <ion-page>
        <my-header></my-header>
        <ion-content :fullscreen="true">
            <ion-toolbar>
                <ion-title size="large" class="ion-text-uppercase">Send a file</ion-title>
            </ion-toolbar>
        </ion-content>
        <ion-grid>
            <ion-row>
                <ion-col class="ion-text-center">
                    <ion-text>Ready to send:</ion-text>
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
                <ion-col size="8" class="ion-text-right">
                    <ion-input class="send-code-input"
                               v-model="code"
                               placeholder="code"
                               readonly
                    ></ion-input>
                </ion-col>
                <ion-col size="1">
                    <copy-button :code="code"
                                 :host="host"/>
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
                    <ion-button color="danger" @click="setOpen(false)">
                        <ion-icon :icon="close"></ion-icon>
                        <ion-text class="ion-padding-start">cancel</ion-text>
                    </ion-button>
                </ion-col>
            </ion-row>
        </ion-grid>
        <version-footer></version-footer>
    </ion-page>
</template>

<style lang="css" scoped>
    .size {
        font-size: small;
    }

    .filename {
        font-weight: bold;
    }
</style>

<script>
    import {
        IonButton,
        IonCol,
        IonContent,
        IonGrid,
        IonIcon,
        IonInput,
        IonPage,
        IonRow,
        IonText,
        IonTitle,
        IonToolbar,
        IonProgressBar,
    } from '@ionic/vue';
    import {close} from 'ionicons/icons';
    import {defineComponent} from 'vue';

    import ClientWorker from '@/go/wormhole/client_worker';
    import {sizeToClosestUnit} from '@/util';

    import router from '@/router/index.ts'
    import MyHeader from '@/components/MyHeader.vue';
    import VersionFooter from "@/components/VersionFooter";
    import CopyButton from "@/components/CopyButton";

    // TODO: move
    function encodeFileInfo(info) {
        return window.btoa(JSON.stringify(info));
    }

    const PROGRESS_INDETERMINATE = 'indeterminate'
    const PROGRESS_DETERMINATE = 'determinate'
    const PROGRESS_DONE_TIMEOUT_MS = 500;

    export default defineComponent({
        name: "SendModal.vue",
        props: ['setOpen', 'file'],
        data() {
            // TODO: refactor
            let host = 'http://localhost:8080';
            if (process.env.NODE_ENV === 'production') {
                host = 'https://wormhole.bryanchriswhite.com';
            }

            return {
                code: '',
                client: new ClientWorker(),
                host,
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
        async beforeMount() {
            const fileCode = await this.client.sendFile(this.file, this.onProgress);
            // const fileCode = await this.client.sendFile(this.file);

            // TODO: expose more of wormhole-william and handle this internally!
            const fileStats = encodeFileInfo({
                name: this.file.name,
                size: this.file.size,
                fileCode,
            });
            this.code = await this.client.sendText(fileStats)
        },
        methods: {
            onProgress(sentBytes, totalBytes) {
                // this.progress.doneID++;
                // console.log(`count: ${this.progress.doneID} | ${sentBytes/totalBytes * 100}%`)
                // if (this.progress.updateID > 0) {
                //    window.clearTimeout(this.progress.updateID)
                // }
                // this.progress.updateID = window.setTimeout(() => {
                //     console.log('debounced')
                    if (this.progress.type === PROGRESS_INDETERMINATE) {
                        this.progress.type = PROGRESS_DETERMINATE;
                    }

                    if (this.progress.doneID > 0) {
                        window.clearTimeout(this.progress.doneID);
                    }
                    this.progress.doneID = window.setTimeout(this.resetProgress, PROGRESS_DONE_TIMEOUT_MS);
                // }, PROGRESS_UPDATE_TIMEOUT_MS);
            },
            resetProgress() {
                console.log('resetting progress');
                console.log(this.progress);
                // this.progress.type = PROGRESS_INDETERMINATE;
                // this.progress.value = -1;
                this.progress.doneID = -1;
            },

        },
        setup() {
            return {
                close,
                router,
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
            IonInput,
            IonProgressBar,
            MyHeader,
            VersionFooter,
            CopyButton,
        },
    });
</script>
