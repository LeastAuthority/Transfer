<template>
    <ion-page>
        <ion-tabs>
            <ion-tab-bar slot="bottom">
                <ion-tab-button tab="send" href="/s">
                    <ion-icon :icon="exit"/>
                    <ion-label>Send</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="receive" href="/r">
                    <ion-icon :icon="enterOutline"/>
                    <ion-label>Receive</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script lang="ts">
    import {
        IonTabBar,
        IonTabButton,
        IonTabs,
        IonLabel,
        IonIcon,
        IonPage,
    } from '@ionic/vue';
    import {defineComponent} from 'vue';
    import {exit, enterOutline} from 'ionicons/icons';

    export default defineComponent({
        name: 'Tabs',
        components: {
            IonLabel,
            IonTabs,
            IonTabBar,
            IonTabButton,
            IonIcon,
            IonPage,
        },
        setup() {
            return {
                exit,
                enterOutline
            }
        }
    });
</script>
