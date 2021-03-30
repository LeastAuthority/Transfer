<template>
    <ion-page>
        <my-header></my-header>
        <ion-content :fullscreen="true">
            <ion-toolbar>
                <ion-title size="large" class="ion-text-uppercase">Send a file</ion-title>
            </ion-toolbar>
            <ion-grid v-if="!done">
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text color="medium">
                            <h4>
                                Send files securely, easily, and fast.
                            </h4>
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-button class="select-button"
                                    color="light"
                                    size="large"
                                    @click="select">
                            <ion-icon :icon="add"></ion-icon>
                            <ion-label class="ion-text-lowercase">select</ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>

            <ion-grid v-else>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text>Sent!</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text class="filename">{{ file.name }}</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-text class="size">({{ fileSize() }})</ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-text class="ion-text-center">
                            <h1>
                                &#x1f389; <!-- party popper -->
                            </h1>
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-button color="light"
                                    @click="sendMore()">
                            <ion-icon :icon="add"></ion-icon>
                            <ion-text class="ion-padding-start">Send more</ion-text>
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
                    :setDone="setDone"
                    :selectFile="select"
                    :file="file"
            ></SendModal>
        </ion-modal>
        <input id="fileInput"
               type="file"
               class="ion-hide"
               @change="fileChanged"
        />
        <version-footer></version-footer>
    </ion-page>
</template>

<style lang="css">
    .modal {
        --min-width: 100vw;
        --min-height: 100vh;
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
    import VersionFooter from "@/components/VersionFooter.vue";
    import router from '@/router/index.ts'
    import {sizeToClosestUnit} from "@/util";

    const isOpenRef = ref(false);
    // let loadedFile: File;
    let fileInput: HTMLInputElement;

    interface SendData {
        file: File | null;
        done: boolean;
    }

    export default defineComponent({
        name: 'Send',
        data(): SendData {
            return {
                file: null,
                done: false,
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
            VersionFooter,
        },
        mounted() {
            // TODO: do this more vue idiomatically
            fileInput = document.querySelector('#fileInput') as HTMLInputElement;
            console.log('route params:');
            console.log(this.$route)
            if (typeof (this.$route.query.select) !== 'undefined') {
                this.select();
            }
        },
        methods: {
            select() {
                fileInput.click();
            },
            setOpen(state: boolean) {
                isOpenRef.value = state;
            },
            setDone(done: boolean) {
                console.log(`set done called: ${done}`);
                this.done = done;
            },
            fileChanged() {
                if (fileInput!.files!.length > 0) {
                    this.file = fileInput!.files![0];
                    this.setOpen(true);
                }
            },
            fileSize(): string {
                return sizeToClosestUnit(this.file!.size);
            },
            sendMore() {
                this.done = false;
                this.select();
            },
        },
        setup() {
            return {
                add,
                isOpenRef,
                router,
            };
        }
    });
</script>
