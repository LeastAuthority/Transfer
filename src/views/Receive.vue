<template>
    <ion-page>
        <my-header></my-header>
        <ion-content :fullscreen="true">
            <ion-toolbar>
                <ion-title size="large" class="ion-text-uppercase">Receive a file</ion-title>
            </ion-toolbar>

            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <ion-col size="8">
                        <ion-input class="receive-code-input"
                                   autofocus
                                   :clearInput="code !== ''"
                                   style="border: 1px solid #424242; border-radius: 5px;"
                                   type="text"
                                   placeholder="Enter code here"
                                   v-model="code"
                        ></ion-input>
                    </ion-col>
                    <ion-col size="1">
                        <ion-button color="light"
                                    disabled>
                            <ion-icon :icon="clipboardOutline"
                                      @click="paste"></ion-icon>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-justify-content-center">
                    <ion-col class="ion-text-center">
                        <ion-button class="receive-next"
                                    color="light"
                                    @click="navigate()">
                            <ion-text class="ion-text-capitalize">Next</ion-text>
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
        IonToolbar,
        IonTitle,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        IonText,
        IonIcon,
        IonInput, alertController,
    } from '@ionic/vue';
    import {clipboardOutline} from 'ionicons/icons'
    import {defineComponent} from 'vue';

    import router from '@/router/index.ts'
    import MyHeader from '@/components/MyHeader.vue'
    import VersionFooter from "@/components/VersionFooter.vue";

    export default defineComponent({
        name: 'Receive',
        data() {
            return {
                code: '',
            }
        },
        components: {
            IonToolbar,
            IonTitle,
            IonContent,
            IonPage,
            IonGrid,
            IonRow,
            IonCol,
            IonButton,
            IonText,
            IonIcon,
            IonInput,
            MyHeader,
            VersionFooter,
        },
        methods: {
            codeIsValid() {
                return /^\d+-\w+-\w+$/.test(this.code);
            },
            // TODO: can this error handling / alertController call be moved into an action?
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
            navigate() {
                if (!this.codeIsValid()) {
                    this.presentAlert('Invalid code format');
                    return;
                }

                router.replace(`/receive/${this.code}`);
            },
            paste() {
                console.log('paste clicked.')
            },
        },
        setup() {
            return {
                clipboardOutline,
                router,
            }
        }
    });
</script>
