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
                :active="onStep(ReceiveStep.Default)"
                :next="nextFrom(ReceiveStep.Default)"
        ></ReceiveDefault>
        <ReceiveConsent
                :active="onStep(ReceiveStep.Consent)"
                :back="backFrom(ReceiveStep.Consent)"
                :next="nextFrom(ReceiveStep.Consent)"
        ></ReceiveConsent>

        <!--  // TODO: -->
<!--        <ReceiveProgress-->
<!--        :active="onStep(ReceiveStep.Progress)"-->
        <!--        ></ReceiveProgress>-->

        <ReceiveComplete
                :active="onStep(ReceiveStep.Complete)"
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
import {RESET_PROGRESS, SET_CODE, SET_FILE_META, SET_PROGRESS} from "@/store/actions";
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
        ...mapMutations([SET_FILE_META, RESET_PROGRESS]),
        onStep(step: ReceiveStep): boolean {
            return this.step === step;
        },
        stepForward() {
            if (this.step < ReceiveStep.Complete) {
                this.step++;
            } else {
                this.step = ReceiveStep.Default;
                this[RESET_PROGRESS]();
                this[SET_FILE_META]({name: '', size: 0});
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
        backFrom(step: ReceiveStep): () => void {
            return (): void => {
                if (this.step === step) {
                    this.stepBack();
                }
            }
        },
    },
    components: {
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
