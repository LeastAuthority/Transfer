<template>
    <!--    <transition name="step-fade">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <ion-text class="bold" color="dark-grey">
                    Ready to send!
                </ion-text>
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center ion-margin-top">
                    <FileCard :name="file && file.name"
                              :size="file && file.size"
                    ></FileCard>
                </ion-row>
                <ion-row class="ion-text-center ion-margin-top">
                    <ion-col>
                        <p>
                            <ion-text class="bold">
                                1. Keep this tab open
                            </ion-text>
                        </p>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center ion-margin-top">
                    <ion-col>
                        <p>
                            <ion-text>
                                Files are sent directly from your device. <br/>The link/code expires once you close the
                                tab.
                            </ion-text>
                        </p>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center ion-margin-top">
                    <ion-col>
                        <p>
                            <ion-text color="dark-grey" class="bold">
                                2. Give the receiver the link below
                            </ion-text>
                        </p>
                    </ion-col>
                </ion-row>
                <ion-row
                        class="ion-text-center ion-justify-content-center ion-margin-top">
                    <ion-col sizeLg="6"
                             sizeMd="7"
                             sizeSm="9"
                             sizeXs="12"
                    >
                        <ion-input color="black"
                                   class="send-code-input"
                                   placeholder="receive link"
                                   autofocus
                                   readonly
                                   :value="shortLink"
                        ></ion-input>
                    </ion-col>
                    <ion-col class="ion-text-sm-start ion-text-xs-center"
                             sizeSm="2"
                             sizeXs="4"
                    >
                        <CopyButton class="ion-margin-start copy-button"
                                    :link="link"
                                    :disabled="!linkReady"
                        ></CopyButton>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-text-center ion-margin-top ion-margin-bottom">
                    <ion-col>
                        <ion-button color="medium-grey"
                                    @click="cancel()">
                            <ion-icon slot="start" :icon="close"></ion-icon>
                            <ion-label slot="end">Cancel</ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </div>
    <!--    </transition>-->
</template>

<style lang="css" scoped>
@media screen and (max-width: 575px) {
    .ion-text-xs-center {
        justify-content: center;
    }

    .ion-text-xs-center ion-button {
        margin-left: 0;
    }
}

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

import {NEW_CLIENT, RESET_PROGRESS} from "@/store/actions";
import CopyButton from "@/components/CopyButton.vue";
import FileCard from "@/components/FileCard.vue";

export default defineComponent({
    name: "SendInstructions",
    props: ['active', 'selectFile', 'file', 'back'],
    computed: {
        ...mapState(['host', 'code', 'progress']),
        // TODO: vuex getter?
        link(): string {
            // TODO: move to utils.
            return `${this.host}/#/${this.code}`;
        },
        // TODO: vuex getter?
        shortLink(): string {
            return this.link.replace(/https?:\/\//, '');
        },
        // TODO: vuex getter?
        linkReady(): boolean {
            // TODO: consolidate with CODE_REGEX.
            return /\/#\/\d+-(\w-?)+$/.test(this.link);
        }
    },
    methods: {
        ...mapActions([NEW_CLIENT]),
        ...mapMutations([RESET_PROGRESS]),
        cancel() {
            // TODO: move up to Send.vue
            this.back();
            this[RESET_PROGRESS]();

            // this.reset();
        },
        reset() {
            // TODO: remove.
            // this[NEW_CLIENT]();
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
        FileCard,
    },
    setup() {
        return {
            copy,
            close,
        }
    },
});
</script>
