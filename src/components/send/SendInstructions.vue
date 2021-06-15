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
                             sizeLg="5"
                             sizeMd="8"
                             sizeSm="10"
                             sizeXs="12"
                    >
                        <ion-input class="send-code-input"
                                   v-model="code"
                                   placeholder="code"
                                   readonly
                        ></ion-input>
                        <copy-button class="ion-margin-start"
                                     color="yellow"
                                     :code="code"
                                     :host="host"/>
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
            <!--                <div class="flex-col">-->
            <!--                    <div class="flex-row ion-text-center ion-padding-top ion-padding-bottom">-->
            <!--                    </div>-->
            <!--                    <div class="flex-row ion-text-center ion-padding-top ion-padding-bottom">-->
            <!--                        &lt;!&ndash;                    <ion-button class="select-button"&ndash;&gt;-->
            <!--                        &lt;!&ndash;                                color="medium"&ndash;&gt;-->
            <!--                        &lt;!&ndash;                                size="large">&ndash;&gt;-->
            <!--                        &lt;!&ndash;                        <ion-icon class="dark-label-icon" :icon="copy"></ion-icon>&ndash;&gt;-->
            <!--                        &lt;!&ndash;                        <ion-label color="dark" class="ion-text-lowercase">copy</ion-label>&ndash;&gt;-->
            <!--                        &lt;!&ndash;                    </ion-button>&ndash;&gt;-->
            <!--                    </div>-->
            <!--                    <div class="flex-row ion-text-center ion-padding-top ion-padding-bottom">-->
            <!--                    </div>-->
            <!--                    <div class="flex-row ion-text-center ion-padding-top ion-padding-bottom">-->
            <!--                    </div>-->
            <!--                </div>-->
        </ion-card-content>
    </div>
    <!--    </transition>-->
    <!--    <ion-page>-->
    <!--        <my-header></my-header>-->
    <!--        <ion-content :fullscreen="true">-->
    <!--            <ion-toolbar>-->
    <!--                <ion-title size="large" class="ion-text-uppercase">Send a file</ion-title>-->
    <!--            </ion-toolbar>-->
    <!--            <ion-grid>-->
    <!--                <ion-row>-->
    <!--                    <ion-col class="ion-text-center">-->
    <!--                        <ion-text>Ready to send:</ion-text>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row>-->
    <!--                    <ion-col class="ion-text-center">-->
    <!--                        <ion-text class="filename">{{ file.name }}</ion-text>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row>-->
    <!--                    <ion-col class="ion-text-center">-->
    <!--                        <ion-text class="size">({{ fileSize }})</ion-text>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row>-->
    <!--                    <ion-col size="8" class="ion-text-right">-->
    <!--                        <ion-input class="send-code-input"-->
    <!--                                   v-model="code"-->
    <!--                                   placeholder="code"-->
    <!--                                   readonly-->
    <!--                        ></ion-input>-->
    <!--                    </ion-col>-->
    <!--                    <ion-col size="1">-->
    <!--                        <copy-button :code="code"-->
    <!--                                     :host="host"/>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row>-->
    <!--                    <ion-col>-->
    <!--                        <ion-progress-bar color="primary"-->
    <!--                                          v-show="progress >= 0"-->
    <!--                                          :value="progress"-->
    <!--                        ></ion-progress-bar>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--                <ion-row>-->
    <!--                    <ion-col class="ion-text-center">-->
    <!--                        <ion-button color="danger"-->
    <!--                                    @click="cancel()">-->
    <!--                            <ion-icon :icon="close"></ion-icon>-->
    <!--                            <ion-text class="ion-padding-start">cancel</ion-text>-->
    <!--                        </ion-button>-->
    <!--                    </ion-col>-->
    <!--                </ion-row>-->
    <!--            </ion-grid>-->
    <!--        </ion-content>-->
    <!--        <version-footer></version-footer>-->
    <!--    </ion-page>-->
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
    IonContent,
    IonGrid,
    IonIcon,
    IonInput,
    IonPage,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar,
    IonProgressBar,
    alertController, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonLabel,
} from '@ionic/vue';
import {copy, close} from 'ionicons/icons';
import {defineComponent, Transition} from 'vue';
import {mapState, mapActions} from 'vuex';
import {add} from 'ionicons/icons';

import {sizeToClosestUnit} from '@/util';

import router from '@/router'
import MyHeader from '@/components/MyHeader.vue';
import VersionFooter from "@/components/VersionFooter.vue";
import CopyButton from "@/components/CopyButton.vue";
import {NEW_CLIENT, SEND_FILE} from "@/store/actions";

export default defineComponent({
    name: "SendInstructions",
    props: ['active', 'selectFile', 'file', 'back', 'next', 'complete'],
    computed: {
        ...mapState(['host', 'code', 'progress']),
        fileSize(): string {
            return sizeToClosestUnit(this.file.size);
        },
    },
    async beforeUpdate() {
        console.log('beforeUpdate');
        if (this.active) {
            const opts = {progressFunc: this.onProgress};
            const payload = {file: this.file, opts};
            try {
                await this[SEND_FILE](payload)
                        .catch(async (error) => {
                            // NB: error during transfer.
                            console.error(error);
                            const opts = {
                                buttons: ['OK'],
                            };
                            await this.alert({error, opts});
                            this.cancel();
                        });
                this.complete();
            } catch (error) {
                // NB: error during setup.
                console.error(error);
                const opts = {
                    // cssClass: 'my-custom-class',
                    // header: 'Error',
                    // subHeader: 'error type',
                    // message: error,
                    buttons: ['OK'],
                };
                await this.alert({error, opts})
                this.cancel();
            }
        }
    },
    methods: {
        ...mapActions([NEW_CLIENT, SEND_FILE, 'alert', 'setProgress', 'setOpen', 'setDone']),
        onProgress(sentBytes: number, totalBytes: number) {
            this.next();
            this.setProgress(sentBytes / totalBytes)
        },
        cancel() {
            // this.setOpen(false);
            this.back();
            this.reset();
        },
        //     sendMore() {
        //         this.setOpen(false);
        //         this.selectFile();
        //         // NB: wait for animation to finish.
        //         window.setTimeout(() => {
        //             this.reset();
        //         }, 300);
        //     },
        reset() {
            this[NEW_CLIENT]();
        },
    },
    // beforeRouteLeave(to, _from, next) {
    //     this.setOpen(false);
    //     this.reset();
    // },
    components: {
        // Transition,
        // IonPage,
        // IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonLabel,
        IonButton,
        // IonToolbar,
        // IonTitle,
        IonIcon,
        IonInput,
        IonCardHeader,
        IonCardTitle,
        // IonCardSubtitle,
        IonCardContent,
        // IonProgressBar,
        // MyHeader,
        // VersionFooter,
        CopyButton,
    },
    setup() {
        return {
            copy,
            close,
            // router,
        }
    },
});
</script>
