<template>
    <ion-page>
        <my-header></my-header>
        <ion-content :fullscreen="true">
            <ion-toolbar>
                <ion-title size="large" class="ion-text-uppercase">Receive a file</ion-title>
            </ion-toolbar>
        </ion-content>
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
                    <ion-button class="download-button" color="light">
                        <ion-icon :icon="cloudDownloadOutline"></ion-icon>
                        <ion-text class="ion-padding-start"
                                  @click="download"
                        >Download</ion-text>
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
    } from '@ionic/vue';
    import {defineComponent} from 'vue';
    import {cloudDownloadOutline, close} from 'ionicons/icons';
    import streamSaver from 'streamsaver';

    import router from '@/router/index.ts'
    import MyHeader from '@/components/MyHeader.vue';
    import VersionFooter from '@/components/VersionFooter.vue';
    import Client from '@/go/wormhole/client.ts';
    import {sizeToClosestUnit} from "@/util";

    // TODO: move
    function decodeFileInfo(infoStr) {
        return JSON.parse(window.atob(infoStr))
    }

    export default defineComponent({
        name: "ReceiveConfirm",
        data() {
            return {
                client: new Client(),
                file: {
                    name: '',
                    size: 0,
                    code: '',
                    dataURI: '',
                },
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
            this.file = {name, size, code};
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
            MyHeader,
            VersionFooter,
        },
        methods: {
            // TODO: move this to Receive.vue
            async download() {
                console.log('downloading...')
                const fileStream = streamSaver.createWriteStream(this.file.name, {
                    size: this.file.size,
                })
                const writer = fileStream.getWriter();
                const bufferSize = 1024 * 4 // 4KiB
                const buf = new Uint8Array(bufferSize)
                const recvReader = await this.client.recvFile(this.file.code)
                for (let n = 0, done = false; !done;) {
                    [n, done] = await recvReader.read(buf);
                    await writer.write(buf.slice(0, n));
                }
                await writer.close();
                console.log('downloaded!')
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
