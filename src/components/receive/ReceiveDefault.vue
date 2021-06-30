<template>
    <!--    <transition name="step-fade" mode="out-in">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <ion-text color="dark-grey" class="bold">
                    Receive files with ease, speed, and security
                </ion-text>
            </ion-card-title>
            <ion-card-subtitle>
                <ion-text color="black">
                    Always end-to-end encrypted.
                </ion-text>
            </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-text-center ion-justify-content-center ion-align-items-center">
                    <ion-col class="input-col"
                             sizeLg="6"
                             sizeMd="7"
                             sizeSm="9"
                             sizeXs="9"
                    >
                        <ion-input color="black"
                                   :class="{invalid: blurInvalid}"
                                   autofocus
                                   :clearInput="code !== ''"
                                   type="text"
                                   placeholder="Enter code here"
                                   v-model="_code"
                                   @change="validate"
                        ></ion-input>
                        <ion-text :color="exampleErrorColor">
                            {{ exampleErrorText }}
                        </ion-text>
                    </ion-col>
                    <ion-col class="next-col ion-align-self-start ion-text-start"
                             sizeXs="3"
                    >
                        <WaitButton class="ion-no-margin receive-next"
                                    :disabled="!codeIsValid"
                                    :click="_next">
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

<style lang="css" scoped>
.invalid {
    border: 1px solid var(--ion-color-warning-red);
}

@media screen and (max-width: 455px) {
    .input-col {
        flex: 0 0 100% !important;
        width: 100% !important;
        max-width: 100% !important;
    }

    .next-col {
        text-align: center !important;
    }
}

@media screen and (max-width: 575px) {
    .receive-next {
        margin-left: 0;
    }

    .ion-text-xs-center {
        justify-content: center;
    }
}
</style>

<script lang="ts">
import {
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonGrid, IonInput,
    IonRow, IonSpinner,
    IonText
} from "@ionic/vue";
import {mapActions, mapMutations, mapState} from "vuex";
import {ALERT, SAVE_FILE, SET_CODE} from "@/store/actions";
import {defineComponent} from "vue";
import WaitButton from "@/components/WaitButton.vue";
import {ErrBadCode, ErrInvalidCode} from "@/errors";

const errorColor = 'warning-red';
const exampleColor = 'dark-grey';
const errorText = ErrInvalidCode.message;
const exampleText = 'E.g.: 7-guitarist-revenge';

export default defineComponent({
    name: "ReceiveDefault",
    props: ['active', 'next', 'reset'],
    data() {
        return {
            exampleErrorColor: exampleColor,
            exampleErrorText: exampleText,
        }
    },
    computed: {
        ...mapState(['code']),
        // TODO: vuex getter?
        codeIsValid(): boolean {
            return /^\d+-\w+-\w+$/.test(this.code as unknown as string);
        },
        blurInvalid(): boolean {
            return this.code !== '' && this.exampleErrorColor === errorColor;
        },
        _code: {
            get: function (): string {
                return this.code;
            },
            set: function (code: string) {
                this[SET_CODE](code);
            }
        }
    },
    methods: {
        ...mapActions([SAVE_FILE, ALERT]),
        ...mapMutations([SET_CODE]),
        _setCode(code: string): void {
            this[SET_CODE](code);
        },
        async _next(): Promise<void> {
            try {
                const {done} = await this[SAVE_FILE](this.code);
                this.next();
                done.then(() => console.log("DONE")).catch(() => console.log("CATCH"));
            } catch (error) {
                console.error(error);
                this.reset();
            }
        },
        validate(): void {
            if (/\d+(-\w+)+/.test(this._code)) {
                this.exampleErrorText = exampleText;
                this.exampleErrorColor = exampleColor;
            } else {
                this.exampleErrorText = errorText;
                this.exampleErrorColor = errorColor;
            }
        }
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
        IonSpinner,
        WaitButton,
    }
})
</script>
