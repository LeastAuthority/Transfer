<template>
    <!--    <transition name="step-fade">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <!--            {{title}}-->
                Ready to send from your device!
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-text-center ion-margin-top ion-padding-top ion-padding-bottom">
                    <ion-col>
                        <!--                TODO: file size?-->
                        {{ file?.name }}
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center ion-margin-top ion-padding-top ion-padding-bottom">
                    <ion-col>
                        <ion-text class="bold">
                            1. Give the receiver the link below
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row
                        class="ion-text-center ion-justify-content-center ion-margin-top ion-padding-top ion-padding-bottom">
                    <ion-col style="display: flex;"
                             sizeLg="6"
                             sizeMd="8"
                             sizeSm="10"
                             sizeXs="12"
                    >
                        <ion-input class="send-code-input"
                                   placeholder="receive link"
                                   readonly
                                   :value="link"
                        ></ion-input>
                        <CopyButton class="ion-margin-start"
                                    :link="link"
                        ></CopyButton>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center ion-margin-top ion-padding-top ion-padding-bottom">
                    <ion-col>
                        <ion-text class="bold">
                            2. Keep this tab open until you're notified that they have received the file
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center ion-margin-top ion-margin-bottom  ion-padding-top ion-padding-bottom">
                    <ion-col>
                        <ion-button color="grey"
                                    @click="cancel()">
                            <ion-icon :icon="close"></ion-icon>
                            <ion-label class="ion-padding-start">cancel</ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </div>
    <!--    </transition>-->
</template>

<style lang="css" scoped>
.step-fade-enter-active, .step-fade-leave-active {
    transition: opacity .3s ease;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.step-fade-enter-from, .step-fade-leave-to {
    opacity: 0;
}

.send-code-input {
    background-color: var(--ion-color-light);
}

.size {
    font-size: small;
}

.filename {
    font-weight: bold;
}
</style>

<script lang="ts">
import {
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonInput,
    IonRow,
    IonText,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonLabel,
} from '@ionic/vue';
import {copy, close} from 'ionicons/icons';
import {defineComponent, Transition} from 'vue';
import {mapState, mapActions, mapMutations} from 'vuex';

import {sizeToClosestUnit} from '@/util';

import {ALERT, NEW_CLIENT, RESET_PROGRESS} from "@/store/actions";
import CopyButton from "@/components/CopyButton.vue";

export default defineComponent({
    name: "SendInstructions",
    props: ['active', 'selectFile', 'file', 'back'],
    computed: {
        ...mapState(['host', 'code', 'progress']),
        fileSize(): string {
            return sizeToClosestUnit(this.file.size);
        },
        link(): string {
            // TODO: move to utils.
            return `${this.host}/#/${this.code}`;
        },
    },
    methods: {
        ...mapActions([NEW_CLIENT, ALERT]),
        ...mapMutations([RESET_PROGRESS]),
        cancel() {
            // TODO: move up to Send.vue
            this.back();
            this[RESET_PROGRESS]();

            this.reset();
        },
        reset() {
            // TODO: remove.
            this[NEW_CLIENT]();
        },
    },
    components: {
        // Transition,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonLabel,
        IonButton,
        IonIcon,
        IonInput,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
        CopyButton,
    },
    setup() {
        return {
            copy,
            close,
        }
    },
});
</script>
