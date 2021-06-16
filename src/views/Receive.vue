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
                :complete="nextFrom(ReceiveStep.Progress)"
        ></ReceiveConsent>

        <ReceiveProgress
                :active="onStep(ReceiveStep.Progress)"
                :back="goToStep(ReceiveStep.Default)"
        ></ReceiveProgress>

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
import CardModal from "@/components/CardModal.vue";
import ReceiveDefault from "@/components/receive/ReceiveDefault.vue";
import ReceiveConsent from "@/components/receive/ReceiveConsent.vue";
import ReceiveComplete from "@/components/receive/ReceiveComplete.vue";
import {ReceiveStep} from "@/types";
import {ALERT, RESET_PROGRESS, SAVE_FILE, SET_CODE, SET_FILE_META, SET_PROGRESS} from "@/store/actions";
import {mapActions, mapMutations, mapState} from "vuex";
import ReceiveProgress from "@/components/receive/ReceiveProgress.vue";

export default defineComponent({
    name: 'Receive',
    async beforeUpdate() {
        if (typeof (this.$route.query.hasCode) !== 'undefined') {
            await this.$router.replace('/r');
            try {
                await this[SAVE_FILE](this.code);
                this.step = ReceiveStep.Consent;
            } catch (error) {
                console.error(error);
                const opts = {
                    // cssClass: 'my-custom-class',
                    // header: 'Error',
                    // subHeader: 'error type',
                    // message: error,
                    buttons: ['OK'],
                };
                await this[ALERT]({error, opts})
            }
        }
    },
    data() {
        return {
            step: 0,
        }
    },
    computed: {
        ...mapState(['code']),
    },
    methods: {
        ...mapActions([SAVE_FILE, ALERT]),
        ...mapMutations([SET_FILE_META, RESET_PROGRESS]),
        onStep(step: ReceiveStep): boolean {
            return this.step === step;
        },
        stepForward(): void {
            if (this.step < ReceiveStep.Complete) {
                this.step++;
            } else {
                this.step = ReceiveStep.Default;
                this[RESET_PROGRESS]();
                this[SET_FILE_META]({name: '', size: 0});
            }
        },
        stepBack(): void {
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
        goToStep(step: ReceiveStep): () => void {
            return (): void => {
                this.step = step;
            }
        },
    },
    components: {
        CardModal,
        ReceiveDefault,
        ReceiveConsent,
        ReceiveProgress,
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
