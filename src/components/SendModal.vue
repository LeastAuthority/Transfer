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
                    <ion-text class="filename">Filename.ext</ion-text>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col class="ion-text-center">
                    <ion-text class="size">(900 MB)</ion-text>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col size="8">
                    <ion-input v-model="code"></ion-input>
                </ion-col>
                <ion-col size="1">
                    <ion-button color="light">
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
    } from '@ionic/vue';
    import {clipboardOutline, close} from 'ionicons/icons';
    import {defineComponent} from 'vue';

    import {sendTextMsg} from '@/go';

    import router from '@/router/index.ts'
    import MyHeader from '@/components/MyHeader.vue';

    export default defineComponent({
        name: "SendModal.vue",
        props: ['setOpen', 'file'],
        data() {
            return {
                code: '',
            }
        },
        beforeMount() {
            // get wormhole code
            const code = sendTextMsg(this.file.name);
            console.log('beforeMount code');
            console.log(JSON.stringify(code));
            // this.file
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