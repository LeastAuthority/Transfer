<template>
<!--    <transition name="step-fade">-->
        <div>
            <ion-card-header>
                <ion-card-title>
                    <!--            {{title}}-->
                    Send files with ease, speed, and security
                </ion-card-title>
                <ion-card-subtitle>
                    <!--            {{subtitle}}-->
                    No sign-ups. No snooping. No nonsense. <span class="italic">Just send</span>.
                </ion-card-subtitle>
            </ion-card-header>
            <ion-card-content class="ion-text-center">
                <div class="flex-col drag-n-drop ion-justify-content-center">
                    <div>
                        <div class="ion-margin-bottom">
                            <ion-text class="bold">
                                drag a file
                            </ion-text>
                        </div>
                        <div class="ion-margin-bottom">
                            <ion-text>
                                or
                            </ion-text>
                        </div>
                        <ion-button class="select-button"
                                    color="grey"
                                    size="large"
                                    @click="select">
                                <ion-icon class="dark-label-icon" :icon="add"></ion-icon>
                                <ion-label class="ion-text-lowercase">select</ion-label>
                        </ion-button>
                    </div>
                </div>
            </ion-card-content>
        </div>
<!--    </transition>-->
</template>

<script>
import {add} from 'ionicons/icons';
import {defineComponent, Transition} from "vue";

import {
    IonButton,
    IonCard, IonCardContent,
    IonCardHeader, IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonIcon,
    IonLabel,
    IonRow,
    IonText
} from "@ionic/vue";

export default defineComponent({
    name: "SendDefault",
    props: ['select'],
    components: {
        // IonGrid,
        // IonRow,
        // IonCol,
        // IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent,
        IonButton,
        IonLabel,
        IonIcon,
        IonText,
        // Transition,
    },
    setup() {
        return {
            add,
        };
    },
});
</script>

<style scoped>
/*:host-context(.button-solid.ion-color) .button-inner {*/
:host(.button-solid.ion-color) .button-native .button-inner {
    background: green !important;
    flex-direction: column !important;
}

.step-fade-enter-active, .step-fade-leave-active {
    transition: opacity .3s ease;
//position: absolute; //top: 0; //left: 0; //right: 0;
}

.step-fade-enter-from, .step-fade-leave-to {
    opacity: 0;
}

.bold {
    font-weight: bold;
}

/* TODO: use ion- classes instead where possible */
.flex-col {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
//justify-content: space-around; align-items: center;
}

.flex-row {
    display: flex;
    align-items: center;
    flex-grow: 1;
}

.flex-row:first-child {
    align-items: flex-end;
}

.flex-row:last-child {
    align-items: initial;
}

ion-card, .drag-n-drop {
    min-height: 33vh;
//max-height: ?;
}

.drag-n-drop {
    align-items: center;
    border: 4px dashed #858789;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.05);
}
</style>
