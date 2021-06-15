<template>
    <transition name="step-fade" mode="out-in">
        <div>
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
                                       @change="(e) => setCode(e.target.value)"
                                       :value="code"
                            ></ion-input>
                        </ion-col>
                        <ion-col size="1">
                            <ion-button class="receive-next"
                                        color="yellow"
                                        @click="next">
                                <ion-text class="ion-text-capitalize">{{ nextButtonContents }}</ion-text>
                            </ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-card-content>
        </div>
    </transition>
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
import {SET_CODE} from "@/store/actions";
import {defineComponent} from "vue";

export default defineComponent({
    name: "ReceiveDefault",
    props: ['next', 'setCode'],
    computed: {
        ...mapState(['code']),
        nextButtonContents(): string {
            return 'Next';
        },
        codeIsValid(): boolean {
            return /^\d+-\w+-\w+$/.test(this.code as unknown as string);
        },
    },
    components: {
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonInput,
        IonButton,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent,
    }
})
</script>

<style scoped>
</style>
