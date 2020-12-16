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
            <SendModal :setOpen="setOpen"></SendModal>
        </ion-modal>
        <input id="fileInput"
               type="file"
               class="ion-hide"
               @change="loadFile"
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
        modalController,
    } from '@ionic/vue';
    import {ref} from 'vue';
    import {add} from 'ionicons/icons';

    import MyHeader from '@/components/MyHeader.vue';
    import SendModal from '@/views/SendModal.vue';

    const isOpenRef = ref(false);
    // let _modal: any;
    // modalController
    //     .create({
    //         component: SendModal,
    //         cssClass: 'modal',
    //         // TODO: content, file stats?
    //         // componentProps: {
    //         //     title: 'New Title'
    //         // },
    //     })
    //     .then(m => _modal = m);

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
        methods: {
            // async openModal() {
            //     return _modal.present();
            // },
            select(event: Event) {
                console.log('selecting!');
                console.log(this);

                // TODO: do this vue idiomatically
                // const target = event.target as HTMLElement;
                const input = document.querySelector('#fileInput'); //  as HTMLElement;
                console.log(input);
                (input as HTMLElement).click();

            },
            loadFile(event: Event) {
                this.setOpen(true);
                console.log('loadFile called');
                console.log(event);
            },
            setOpen(state: boolean) {
                console.log('set open')
                isOpenRef.value = state;
            },
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