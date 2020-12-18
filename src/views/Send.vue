<template>
    <ion-page>
        <my-header></my-header>
        <ion-content :fullscreen="true">
            <ion-toolbar>
                <ion-title size="large" class="ion-text-uppercase">Send a file</ion-title>
            </ion-toolbar>

            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-text color="medium">
                            <h4 class="ion-text-center">
                                Send files securely, easily, and fast.
                            </h4>
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-button color="light"
                                    size="large"
                                    @click="select">
                            <ion-icon :icon="add"></ion-icon>
                            <ion-label class="ion-text-lowercase">select</ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
        <ion-modal
                :is-open="isOpenRef"
                css-class="modal"
                @onDidDismiss="setOpen(false)"
        >
            <SendModal
                    :setOpen="setOpen"
                    :file="file"
            ></SendModal>
        </ion-modal>
        <input id="fileInput"
               type="file"
               class="ion-hide"
               @change="fileChanged"
        />
    </ion-page>
</template>

<style lang="css">
    .modal {
        --min-width: 100vw;
        --min-height: 100vh;
    }
</style>

<script lang="ts">
    import {
        IonPage,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButton,
        IonLabel,
        IonText,
        IonIcon,
        IonGrid,
        IonRow,
        IonCol,
        IonModal,
    } from '@ionic/vue';
    import {ref, defineComponent} from 'vue';
    import {add} from 'ionicons/icons';

    import MyHeader from '@/components/MyHeader.vue';
    import SendModal from '@/components/SendModal.vue';

    const isOpenRef = ref(false);
    // let loadedFile: File;
    let fileInput: HTMLInputElement;

    interface SendData {
        file: File | null;
    }

    export default defineComponent({
        name: 'Send',
        data(): SendData {
            return {
                file: null,
            };
        },
        components: {
            IonToolbar,
            IonTitle,
            IonContent,
            IonPage,
            IonButton,
            IonLabel,
            IonText,
            IonIcon,
            IonGrid,
            IonRow,
            IonCol,
            IonModal,
            MyHeader,
            SendModal,
        },
        mounted() {
            // TODO: do this more vue idiomatically
            fileInput = document.querySelector('#fileInput') as HTMLInputElement;
        },
        methods: {
            select() {
                fileInput.click();
            },
            setOpen(state: boolean) {
                isOpenRef.value = state;
            },
            fileChanged() {
                if (fileInput!.files!.length > 0) {
                    this.file = fileInput!.files![0];
                    this.setOpen(true);
                }
            }
        },
        setup() {
            return {
                add,
                isOpenRef,
            };
        }
    });
</script>