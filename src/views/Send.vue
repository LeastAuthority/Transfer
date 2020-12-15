<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title class="ion-text-uppercase">Send a file</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Send</ion-title>
                </ion-toolbar>
            </ion-header>
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
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButton,
        IonLabel,
        IonText,
        IonIcon,
        IonGrid,
        IonRow,
        IonCol
    } from '@ionic/vue';
    import {add, enterOutline, exit} from 'ionicons/icons';

    export default {
        name: 'Send',
        components: {
            IonHeader,
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
            IonCol
        },
        methods: {
            select(event: Event) {
                console.log('selecting!');
                console.log(this);

                // TODO: figure out how to get a proper ref
                const target = event.target as HTMLElement;
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