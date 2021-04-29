<template>
    <ion-page>
        <my-header></my-header>
        <ion-content :fullscreen="true">
            <ion-toolbar>
                <ion-title size="large" class="ion-text-uppercase">Send a file</ion-title>
            </ion-toolbar>
            <ion-grid v-if="!progress.done">
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
                :is-open="open"
                css-class="modal"
                @onDidDismiss="setOpen(false)"
        >
            <SendModal
                    :selectFile="select"
                    :file="file"
            ></SendModal>
        </ion-modal>
        <input ref="fileInput"
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

<script>
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
    import {mapActions, mapState} from 'vuex';

    // TODO: use proper state management.
    const isOpenRef = ref(false);

    export default defineComponent({
        name: 'Send',
        data() {
            return {
                file: {},
            };
        },
        computed: {
            ...mapState('send', ['open', 'progress']),
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
            if (typeof (this.$route.query.select) !== 'undefined') {
                this.select();
                this.router.replace(this.$route.path)
            }
        },
        methods: {
            ...mapActions('send', ['setOpen', 'setDone']),
            select() {
                this.$refs.fileInput.click();
            },
            fileChanged() {
                const fileInput = this.$refs.fileInput;
                if (fileInput.files.length > 0) {
                    this.file = fileInput.files[0];
                    this.setOpen(true);
                }
            },
            fileSize() {
                return sizeToClosestUnit(this.file.size);
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
            };
        }
    });
</script>
