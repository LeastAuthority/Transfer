<template>
    <CardModal>
        <!--        <transition name="fade">-->
        <SendDefault
                :active="onStep(SendStep.Default)"
                :select="select"
        ></SendDefault>
        <SendInstructions
                :active="onStep(SendStep.Instructions)"
                :back="backFrom(SendStep.Instructions)"
                :next="nextFrom(SendStep.Instructions)"
                :complete="nextFrom(SendStep.Progress)"
                :file="file"
        ></SendInstructions>
        <SendProgress
                :active="onStep(SendStep.Progress)"
                :back="backFrom(SendStep.Progress)"
        ></SendProgress>
        <SendComplete
                :active="onStep(SendStep.Complete)"
                :sendMore="sendMore"
        ></SendComplete>
        <!--        </transition>-->
        <input ref="fileInput"
               type="file"
               class="ion-hide"
               @change="fileChanged"
        />
    </CardModal>
</template>

<style scoped>
/*
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
 */
</style>


<style lang="css">
/*
.modal {
//--min-width: 100vw; //--min-height: 100vh; max-height: 500px;
    max-width: 700px;
} */

.size {
    font-size: small;
}

.filename {
    font-weight: bold;
}
</style>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {add} from 'ionicons/icons';

import {ReceiveStep, SendStep} from "@/types";
import CardModal from '@/components/CardModal.vue';
import SendDefault from '@/components/send/SendDefault.vue';
import SendInstructions from '@/components/send/SendInstructions.vue';
import SendProgress from "@/components/send/SendProgress.vue";
import SendComplete from "@/components/send/SendComplete.vue";
import {RESET_PROGRESS, SET_FILE_META} from "@/store/actions";
import {mapMutations} from "vuex";

// TODO: use proper state management.
const isOpenRef = ref(false);

declare interface SendData {
    step: SendStep;
    file?: File;
}

export default defineComponent({
    name: 'Send',
    data(): SendData {
        return {
            step: SendStep.Default,
            file: undefined,
        };
    },
    beforeUpdate() {
        if (typeof(this.$route.query.select) !== 'undefined') {
            this.$router.replace('/s');
            this.select();
        }
    },
    methods: {
        ...mapMutations([SET_FILE_META, RESET_PROGRESS]),
        select() {
            (this.$refs.fileInput as HTMLInputElement).click();
        },
        fileChanged() {
            const fileInput = this.$refs.fileInput as HTMLInputElement;
            if (fileInput.files!.length > 0) {
                this.file = fileInput.files![0] as File;
                this.step = SendStep.Instructions;
            }
        },
        sendMore(): void {
            this.step = SendStep.Default;
            this.$router.replace('/s');
            this.select();
        },
        onStep(step: SendStep): boolean {
            return this.step === step;
        },
        stepForward() {
            if (this.step < SendStep.Complete) {
                this.step++;
            } else {
                this.step = SendStep.Default;
                this[RESET_PROGRESS]();
                this[SET_FILE_META]({name: '', size: 0});
            }
        },
        stepBack() {
            if (this.step > SendStep.Default) {
                this.step--;
            }
        },
        nextFrom(step: SendStep): () => void {
            return (): void => {
                if (this.step === step) {
                    this.stepForward();
                }
            }
        },
        backFrom(step: SendStep): () => void {
            return (): void => {
                if (this.step === step) {
                    this.stepBack();
                }
            }
        },
    },
    components: {
        // Transition,
        CardModal,
        SendDefault,
        SendInstructions,
        SendProgress,
        SendComplete,
    },
    setup() {
        return {
            add,
            SendStep,
        };
    }
});
</script>
