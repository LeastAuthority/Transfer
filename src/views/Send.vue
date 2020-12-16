<template>
    <ion-page>
        <my-header></my-header>
        <ion-content :fullscreen="true">
            <ion-toolbar>
                <ion-title size="large" class="ion-text-uppercase">Send a file</ion-title>
            </ion-toolbar>

            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-text color="medium">
                            <h4 class="ion-text-center">
                                Send files securely, easily, and fast.
                            </h4>
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-button color="light" size="large" @click="select">
                            <ion-icon :icon="add"></ion-icon>
                            <ion-label class="ion-text-lowercase">select</ion-label>
                        </ion-button>
                        <input id="fileInput" type="file" class="ion-hide"/>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
    import {
        IonPage,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButton,
        IonLabel,
        IonText,
        IonIcon,
        IonGrid,
        IonRow,
        IonCol,
    } from '@ionic/vue';
    import {add} from 'ionicons/icons';
    import MyHeader from '@/components/MyHeader.vue';

    export default {
        name: 'Send',
        components: {
            IonToolbar,
            IonTitle,
            IonContent,
            IonPage,
            IonButton,
            IonLabel,
            IonText,
            IonIcon,
            IonGrid,
            IonRow,
            IonCol,
            MyHeader,
        },
        methods: {
            select(event: Event) {
                console.log('selecting!');
                console.log(this);

                // TODO: do this vue idiomatically
                // const target = event.target as HTMLElement;
                const input = document.querySelector('#fileInput') as HTMLElement;
                console.log(input);
                input.click();

            }
        },
        setup() {
            return {
                add
            }
        }
    }
</script>