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
                v-if="onStep(ReceiveStep.Default)"
                :next="nextFrom(ReceiveStep.Default)"
        ></ReceiveDefault>
        <ReceiveConsent
                v-else-if="onStep(ReceiveStep.Consent)"
                :next="nextFrom(ReceiveStep.Consent)"
                :back="stepBack"
        ></ReceiveConsent>

        <!--  // TODO: -->
<!--        <ReceiveProgress-->
<!--        ></ReceiveProgress>-->

        <ReceiveComplete
                v-else-if="onStep(ReceiveStep.Complete)"
                :next="nextFrom(ReceiveStep.Complete)"
        ></ReceiveComplete>
    </CardModal>
    <!--        </ion-content>-->
    <!--    </ion-page>-->
    <!--    </transition>-->
</template>

<style lang="css">
ion-card {
    /* TODO: use css variable! */
    /* min-height: 730px; */
    min-height: 33vh;
}
</style>

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
    IonInput, alertController,
} from '@ionic/vue';
import {clipboardOutline} from 'ionicons/icons'
import {defineComponent, Transition} from 'vue';

import router from '@/router/index.ts'
// import MyHeader from '@/components/MyHeader.vue'
// import VersionFooter from "@/components/VersionFooter.vue";
import CardModal from "@/components/CardModal.vue";
import ReceiveDefault from "@/components/receive/ReceiveDefault.vue";
import ReceiveConsent from "@/components/receive/ReceiveConsent.vue";
import ReceiveComplete from "@/components/receive/ReceiveComplete.vue";
import {ReceiveStep} from "@/types";
import {SET_CODE} from "@/store/actions";
import {mapMutations} from "vuex";

export default defineComponent({
    name: 'Receive',
    beforeUpdate() {
        if (typeof(this.$route.query.hasCode) !== 'undefined') {
            this.$router.replace('/r');
            this.step = ReceiveStep.Consent;
        }
    },
    data() {
        return {
            // code: '',
            step: 0,
        }
    },
    methods: {
        // TODO: can this error handling / alertController call be moved into an action?
        async presentAlert(error: string) {
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
        },
        // navigate() {
        //     if (!this.codeIsValid()) {
        //         this.presentAlert('Invalid code format');
        //         return;
        //     }
        //
        //     router.replace(`/r/${this.code}`);
        // },
        // paste() {
        //     console.log('paste clicked.')
        // },
        onStep(step: ReceiveStep): boolean {
            return this.step === step;
        },
        stepForward() {
            if (this.step < ReceiveStep.Complete) {
                this.step++;
            } else {
                this.step = ReceiveStep.Default;
            }
        },
        stepBack() {
            if (this.step > ReceiveStep.Default) {
                this.step--;
            }
        },
        nextFrom(step: ReceiveStep): () => void {
            return (): void => {
                if (this.step === step) {
                    this.stepForward();
                }
            }
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
        ReceiveConsent,
        ReceiveComplete,
    },
    setup() {
        return {
            clipboardOutline,
            router,
            ReceiveStep,
        }
    }
});
</script>
