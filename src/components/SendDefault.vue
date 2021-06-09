<template>
    <!--    <ion-card>-->
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
    <ion-card-content>
        <div class="flex-col drag-n-drop">
            <!--    <ion-grid class="drag-n-drop">-->
            <!--        <ion-row>-->
            <!--            <ion-col class="ion-text-center">-->
            <div class="flex-row ion-text-center">
                <ion-text class="bold">
                    drag a file
                </ion-text>
            </div>
            <!--            </ion-col>-->
            <!--        </ion-row>-->
            <!--        <ion-row>-->
            <!--            <ion-col class="ion-text-center">-->
            <div class="flex-row ion-text-center">
                <ion-text>
                    or
                </ion-text>
            </div>
            <!--            </ion-col>-->
            <!--        </ion-row>-->
            <!--        <ion-row>-->
            <!--            <ion-col class="ion-text-center">-->
            <div class="flex-row ion-text-center">
                <ion-button class="select-button"
                            color="medium"
                            size="large"
                            @click="select">
                    <ion-icon class="dark-label-icon" :icon="add"></ion-icon>
                    <ion-label color="dark" class="ion-text-lowercase">select</ion-label>
                </ion-button>
            </div>
            <!--            </ion-col>-->
            <!--        </ion-row>-->
            <!--    </ion-grid>-->
        </div>
    </ion-card-content>
    <!--    </ion-card>-->
</template>

<script>
import {add} from 'ionicons/icons';
import {defineComponent} from "vue";

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
