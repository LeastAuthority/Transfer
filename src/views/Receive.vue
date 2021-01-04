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
                        <ion-input style="border: 1px solid #424242; border-radius: 5px;"
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
                        <ion-button color="light"
                                    @click="navigate(code)">
                            <ion-text class="ion-text-capitalize">Next</ion-text>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
        <version-footer></version-footer>
    </ion-page>
</template>

<script lang="ts">
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
        IonInput,
    } from '@ionic/vue';
    import {clipboardOutline} from 'ionicons/icons'

    import router from '@/router/index.ts'
    import MyHeader from '@/components/MyHeader.vue'
    import VersionFooter from "@/components/VersionFooter.vue";

    export default {
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
            navigate(code: string) {
                router.push(`/receive/${code}`);
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
    }
</script>