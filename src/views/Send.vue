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
                        <ion-button color="light" size="large" @click="select">
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
                    :file="loadedFile()"
            ></SendModal>
        </ion-modal>
        <input id="fileInput"
               type="file"
               class="ion-hide"
               @change="setOpen(true)"
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
    import {ref} from 'vue';
    import {add} from 'ionicons/icons';

    import MyHeader from '@/components/MyHeader.vue';
    import SendModal from '@/components/SendModal.vue';

    const isOpenRef = ref(false);
    // let loadedFile: File;
    let fileInput: HTMLInputElement;

    export default {
        name: 'Send',
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
            select(event: Event) {
                fileInput.click();
            },
            // loadFile(event: Event) {
            //     if (fileInput!.files!.length > 0) {
            //         // NB: only consider first file for now.
            //         loadedFile = fileInput!.files![0];
            //     }
            //
            //     this.setOpen(true);
            // },
            setOpen(state: boolean) {
                isOpenRef.value = state;
            },
            loadedFile(): File | null {
                if (fileInput!.files!.length > 0) {
                    return fileInput!.files![0];
                }
                return null
            }
        },
        setup() {
            // const data = { content: 'New Content' };
            return {
                add,
                isOpenRef,
                // setOpen,
                // data
            };
        }
    }
</script>