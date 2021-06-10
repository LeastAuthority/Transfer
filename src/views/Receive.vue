<template>
<!--    <transition name="slide-secondary">-->
        <!--    <ion-page>-->
        <!--        <ion-content>-->
        <CardModal>
            <!--            :is-open="onStep(Step.Default)"-->
            <!--            css-class="modal"-->
            <!--            @onDidDismiss="setOpen(false)"-->
            <!--    >-->
            <ReceiveDefault
            ></ReceiveDefault>
        </CardModal>
        <!--        </ion-content>-->
        <!--    </ion-page>-->
<!--    </transition>-->
</template>

<style lang="css">
ion-card {
    min-height: 33vh;
}
</style>

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
import {defineComponent, Transition} from 'vue';

import router from '@/router/index.ts'
import MyHeader from '@/components/MyHeader.vue'
import VersionFooter from "@/components/VersionFooter.vue";
import CardModal from "@/components/CardModal";
import ReceiveDefault from "@/components/ReceiveDefault";

export default defineComponent({
    name: 'Receive',
    data() {
        return {
            code: '',
        }
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

            router.replace(`/r/${this.code}`);
        },
        paste() {
            console.log('paste clicked.')
        },
    },
    components: {
        // IonToolbar,
        // IonTitle,
        // IonContent,
        // IonPage,
        // IonGrid,
        // IonRow,
        // IonCol,
        // IonButton,
        // IonText,
        // IonIcon,
        // IonInput,
        // MyHeader,
        // VersionFooter,
        // Transition,
        CardModal,
        ReceiveDefault,
    },
    setup() {
        return {
            clipboardOutline,
            router,
        }
    }
});
</script>
