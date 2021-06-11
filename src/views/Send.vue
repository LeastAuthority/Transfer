<template>
    <!--    <transition name="slide-primary">-->
    <!--    <ion-page>-->
    <!--        <ion-content>-->
    <CardModal>
        <!--            :is-open="onStep(Step.Default)"-->
        <!--            css-class="modal"-->
        <!--            @onDidDismiss="setOpen(false)"-->
        <!--    >-->
        <transition name="fade">
            <SendDefault
                    v-if="onStep(SendStep.Default)"
                    :select="select"
            ></SendDefault>
            <SendInstructions
                    v-else-if="onStep(SendStep.Instructions)"
                    :file="file"
                    :back="stepBack"
                    :next="nextFrom(SendStep.Instructions)"
            ></SendInstructions>
        </transition>
        <input ref="fileInput"
               type="file"
               class="ion-hide"
               @change="fileChanged"
        />
    </CardModal>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
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
import SendDefault from '@/components/send/SendDefault.vue';
import SendInstructions from '@/components/send/SendInstructions.vue';
import CardModal from '@/components/CardModal.vue';
import {SendStep} from "@/types";

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
    // props: ['title', 'subtitle'],
    // computed: {
    //     ...mapState(['open', 'done', 'step']),
    // },
    // mounted() {
    //     if (typeof (this.$route.query.select) !== 'undefined') {
    //         this.select();
    //         this.router.replace(this.$route.path)
    //     }
    // },
    methods: {
        //     ...mapActions(['setOpen', 'setDone', 'nextStep']),
        //     onStep(checkStep: SendStep): boolean {
        //         return this.step === checkStep;
        //     },
        select() {
            (this.$refs.fileInput as HTMLInputElement).click();
        },
        fileChanged() {
            const fileInput = this.$refs.fileInput as HTMLInputElement;
            if (fileInput.files!.length > 0) {
                this.file = fileInput.files![0] as File;
                this.stepForward();
            }
        },
        onStep(step: SendStep): boolean {
            return this.step === step;
        },
        stepForward() {
            if (this.step < SendStep.Complete) {
                this.step++;
            } else {
                this.step = SendStep.Default;
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
                    this.step++;
                }
            }
        },
        //     fileSize() {
        //         return typeof (this.file) !== 'undefined' ?
        //                 sizeToClosestUnit(this.file.size) : '';
        //     },
        //     sendMore() {
        //         this.setDone(false);
        //         this.select();
        //     },
    },
    components: {
        // IonPage,
        // IonContent,
        // IonModal,
        // Transition,
        CardModal,
        SendDefault,
        SendInstructions,
    },
    setup() {
        return {
            add,
            // isOpenRef,
            // router,
            SendStep,
        };
    }
});
</script>
