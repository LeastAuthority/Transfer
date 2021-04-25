<template>
    <ion-page>
        <my-header></my-header>
        <ion-content :fullscreen="true">
            <ion-toolbar>
                <ion-title size="large" class="ion-text-uppercase">Send a file</ion-title>
            </ion-toolbar>
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
                        <ion-button color="danger"
                                    @click="cancel()">
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
        alertController,
    } from '@ionic/vue';
    import {close} from 'ionicons/icons';
    import {defineComponent} from 'vue';
    import {mapState, mapActions} from 'vuex';
    import {add} from 'ionicons/icons';

    import ClientWorker from '@/go/wormhole/client_worker';
    import {sizeToClosestUnit} from '@/util';

    import router from '@/router/index.ts'
    import MyHeader from '@/components/MyHeader.vue';
    import VersionFooter from "@/components/VersionFooter";
    import CopyButton from "@/components/CopyButton";

    export default defineComponent({
        name: "SendModal.vue",
        props: ['setOpen', 'setDone', 'selectFile', 'file'],
        data() {
            return {
                client: new ClientWorker({...this.$store.state.config}),
            }
        },
        computed: {
            ...mapState(['host']),
            ...mapState('send', ['code', 'progress']),
            fileSize() {
                return sizeToClosestUnit(this.file.size);
            },
        },
        async beforeMount() {
            const opts = {progressFunc: this.onProgress};
            try {
                const {code, result} = await this.client.sendFile(this.file, opts);
                this.setCode(code);
                result.done
                    .then(() => {
                        this.setDone(true)
                        this.setOpen(false);
                    })
                    .catch(error => {
                        // NB: error during transfer>
                        console.log(error);
                        this.presentAlert(error);
                    })
            } catch (error) {
                // NB: error during setup.
                console.log(error);
                await this.presentAlert(error);
            }
        },
        methods: {
            ...mapActions('send', ['setCode', 'setProgress', 'setDone']),
            async presentAlert(error) {
                const alert = await alertController
                    .create({
                        // cssClass: 'my-custom-class',
                        header: 'Mailbox Error',
                        // subHeader: 'error type',
                        message: error,
                        buttons: ['OK'],
                    });
                await alert.present();
                await alert.onWillDismiss();
                this.cancel();
            },
            // TODO: refactor
            onProgress(sentBytes, totalBytes) {
                this.setProgress(sentBytes / totalBytes)
            },
            cancel() {
                this.setOpen(false);
                this.reset();
            },
            sendMore() {
                this.setOpen(false);
                this.selectFile();
                // NB: wait for animation to finish.
                window.setTimeout(() => {
                    this.reset();
                }, 300);
            },
            reset() {
                this.client = new ClientWorker();
            },
        },
        setup() {
            return {
                add,
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
