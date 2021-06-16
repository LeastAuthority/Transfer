<template>
<!--    <transition name="step-fade">-->
        <div v-show="active">
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
    IonCardContent,
    IonCardHeader, IonCardSubtitle,
    IonCardTitle,
    IonIcon,
    IonLabel,
    IonText
} from "@ionic/vue";

export default defineComponent({
    name: "SendDefault",
    props: ['select', 'active'],
    components: {
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

ion-card, .drag-n-drop {
    /* TODO: use css variable! */
    /* min-height: 730px; */
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
