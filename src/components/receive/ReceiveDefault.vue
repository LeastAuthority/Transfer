<template>
    <!--    <transition name="step-fade" mode="out-in">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <!--            {{title}}-->
                Receive files with ease, speed, and security
            </ion-card-title>
            <ion-card-subtitle>
                <!--            {{subtitle}}-->
                Always end-to-end encrypted.
            </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center ion-align-items-center">
                    <ion-col size="8">
                        <ion-input class="receive-code-input"
                                   autofocus
                                   :clearInput="code !== ''"
                                   style="border: 1px solid #424242; border-radius: 5px;"
                                   type="text"
                                   placeholder="Enter code here"
                                   @change="(e) => _setCode(e.target.value)"
                                   :value="code"
                        ></ion-input>
                    </ion-col>
                    <ion-col size="1">
                        <WaitButton :click="_next">
                            <template v-slot:text>
                                <ion-text>Next</ion-text>
                            </template>
                            <template v-slot:waiting-text>
                                <ion-spinner name="crescent"
                                             color="dark"
                                ></ion-spinner>
                            </template>
                        </WaitButton>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </div>
    <!--    </transition>-->
</template>

<script lang="ts">
import {
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonGrid, IonInput,
    IonRow,
    IonText
} from "@ionic/vue";
import {mapActions, mapMutations, mapState} from "vuex";
import {SAVE_FILE, SET_CODE} from "@/store/actions";
import {defineComponent} from "vue";
import WaitButton from "@/components/WaitButton.vue";

export default defineComponent({
    name: "ReceiveDefault",
    props: ['active', 'next'],
    computed: {
        ...mapState(['code']),
        codeIsValid(): boolean {
            return /^\d+-\w+-\w+$/.test(this.code as unknown as string);
        },
    },
    methods: {
        ...mapActions([SAVE_FILE, 'alert']),
        ...mapMutations([SET_CODE]),
        _setCode(code: string): void {
            this[SET_CODE](code);
        },
        async _next(): Promise<void> {
            try {
                await this[SAVE_FILE](this.code);
                this.next();
            } catch (error) {
                await this.alert({error});
            }

            // try {
            //     this.receivingPromise = this[SAVE_FILE](this.code);
            //     const {done} = await this.receivingPromise;
            //     await done
            //     this.receivingPromise = undefined;
            //     this.next();
            // } catch (error) {
            //     await this.alert({error});
            //     this.cancel();
            // }
        },
    },
    components: {
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonInput,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent,
        WaitButton,
    }
})
</script>

<style scoped>
</style>
