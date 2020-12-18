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
                    <ion-input v-model="code"></ion-input>
                </ion-col>
                <ion-col size="1">
                    <ion-button color="light"
                                disabled>
                        <ion-icon :icon="clipboardOutline"></ion-icon>
                    </ion-button>
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
    } from '@ionic/vue';
    import {clipboardOutline, close} from 'ionicons/icons';
    import {defineComponent} from 'vue';

    import {sendTextMsg} from '@/go';
    import {sizeToClosestUnit} from '@/util';

    import router from '@/router/index.ts'
    import MyHeader from '@/components/MyHeader.vue';

    // TODO: move
    function encodeFileInfo(info) {
        return window.btoa(JSON.stringify(info));
    }

    export default defineComponent({
        name: "SendModal.vue",
        props: ['setOpen', 'file'],
        data() {
            return {
                code: '',
            }
        },
        computed: {
            fileSize() {
                return sizeToClosestUnit(this.file.size);
            }
        },
        async beforeMount() {
            const fileCode = await new Promise((resolve, reject) => {
                // TODO: use URL.revokeObjectURL where appropriate (see: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL#Usage_notes)
                // const fileBlobEncoded = URL.createObjectURL(this.file);
                // sendTextMsg(fileBlobEncoded, {resolve, reject});
                const reader = new FileReader();
                reader.readAsDataURL(this.file)
                reader.onloadend = () => {
                    console.log(reader.result);
                    sendTextMsg(reader.result, {resolve, reject});
                }
            })

            this.code = await new Promise((resolve, reject) => {
                const {name, size} = this.file;
                const fileStats = encodeFileInfo({
                    name,
                    size,
                    fileCode,
                });
                sendTextMsg(fileStats, {resolve, reject});
            })
        },
        setup() {
            return {
                clipboardOutline,
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
            MyHeader,
        },
    });
</script>