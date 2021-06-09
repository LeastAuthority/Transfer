<template>
    <CardModal
            :is-open="onStep(Step.Default)"
            css-class="modal"
            @onDidDismiss="setOpen(false)"
    >
        <SendDefault
                :select="select"
        ></SendDefault>
    </CardModal>
<!--    <CardModal-->
<!--            :is-open="onStep(Step.SendInstructions)"-->
<!--            css-class="modal"-->
<!--            @onDidDismiss="setOpen(false)"-->
<!--    >-->
<!--        <SendInstructions-->
<!--        ></SendInstructions>-->
<!--    </CardModal>-->
<!--    <CardModal-->
<!--            :is-open="onStep(Step.SendProgress)"-->
<!--            css-class="modal"-->
<!--            @onDidDismiss="setOpen(false)"-->
<!--    >-->
<!--        <SendProgress-->
<!--        ></SendProgress>-->
<!--    </CardModal>-->
<!--    <CardModal-->
<!--            :is-open="onStep(Step.SendSuccess)"-->
<!--            css-class="modal"-->
<!--            @onDidDismiss="setOpen(false)"-->
<!--    >-->
<!--        <SendSuccess-->
<!--        ></SendSuccess>-->
<!--    </CardModal>-->
    <input ref="fileInput"
           type="file"
           class="ion-hide"
           @change="fileChanged"
    />
    <!--        <version-footer></version-footer>-->
    <!--    </ion-page>-->
</template>

<style lang="css">
.modal {
    //--min-width: 100vw;
    //--min-height: 100vh;
    max-height: 500px;
    max-width: 700px;
}

.size {
    font-size: small;
}

.filename {
    font-weight: bold;
}
</style>

<style scoped>
.italic {
    font-style: italic;
}

.bold {
    font-weight: bold;
}

.drag-n-drop {
    background-color: #f2f2f2;
    border-style: dashed;
    border-width: 3px;
}
</style>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {add} from 'ionicons/icons';
import router from '@/router/index.ts'
import {sizeToClosestUnit} from "@/util";
import {mapActions, mapState} from 'vuex';
import SendDefault from '@/components/SendDefault.vue';
import CardModal from '@/components/CardModal.vue';
import {SendStep} from "@/types";
// import {Step} from "@/go/wormhole/types";

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
    computed: {
        ...mapState(['open', 'done', 'step']),
    },
    components: {
        // IonModal,
        CardModal,
        SendDefault,
        // SendInstructions,
    },
    mounted() {
        if (typeof (this.$route.query.select) !== 'undefined') {
            this.select();
            this.router.replace(this.$route.path)
        }
    },
    methods: {
        ...mapActions(['setOpen', 'setDone', 'nextStep']),
        onStep(checkStep: SendStep): boolean {
            return this.step === checkStep;
        },
        select() {
            (this.$refs.fileInput as HTMLInputElement).click();
        },
        fileChanged() {
            const fileInput = this.$refs.fileInput as HTMLInputElement;
            if (fileInput.files!.length > 0) {
                this.file = fileInput.files![0] as File;
                this.setOpen(true);
            }
        },
        fileSize() {
            return typeof (this.file) !== 'undefined' ?
                    sizeToClosestUnit(this.file.size) : '';
        },
        sendMore() {
            this.setDone(false);
            this.select();
        },
    },
    setup() {
        return {
            add,
            isOpenRef,
            router,
            Step: SendStep,
        };
    }
});
</script>
