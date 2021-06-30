<template>
    <!--    <transition name="step-fade">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <ion-text class="bold" color="dark-grey">
                    Send files with ease, speed, and security
                </ion-text>
            </ion-card-title>
            <ion-card-subtitle>
                <ion-text color="dark-grey">
                    No sign-ups. No snooping. No nonsense. <span class="italic">Just send</span>.
                </ion-text>
            </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="ion-text-center">
            <div class="flex-col drag-n-drop ion-justify-content-center"
                 @dragover="dragOver"
                 @drop="drop"
            >
                <div>
                    <div class="ion-margin-vertical">
                        <ion-text color="dark-grey" class="bold">
                            drop a file
                        </ion-text>
                    </div>
                    <div class="ion-margin-bottom">
                        <ion-text color="dark-grey">
                            or
                        </ion-text>
                    </div>
                    <ion-button class="large-button ion-margin-vertical"
                                color="medium-grey"
                                @click="() => select()">
                        <ion-icon slot="icon-only" src="/assets/icon/select.svg"></ion-icon>
                    </ion-button>
                </div>
            </div>
        </ion-card-content>
    </div>
    <!--    </transition>-->
</template>

<script lang="ts">
import {add} from 'ionicons/icons';
import {defineComponent, Transition} from "vue";

import {
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
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
        IonIcon,
        IonText,
        // Transition,
    },
    methods: {
        drop(event: DragEvent) {
            event.preventDefault();
            const files = event.dataTransfer!.files;
            if (files.length > 0) {
                // NB: only dropping first file in list.
                this.select(files[0]);
            } else {
                console.error("no files listed in drop event")
            }
        },
        dragOver(event: DragEvent) {
            event.preventDefault();
        }
    },
    setup() {
        return {
            add,
        };
    },
});
</script>


<style lang="css" scoped>
/* TODO: use ion- classes instead where possible */
.flex-col {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
//justify-content: space-around; align-items: center;
}

.drag-n-drop {
    /* TODO: use css variable! */
    min-height: 60vh;

}

@media screen and (max-height: 800px) {
    .drag-n-drop {
        /* TODO: use css variable! */
        min-height: 50vh;
    }
}

.drag-n-drop {
    align-items: center;
    border: 4px dashed #858789;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.05);
}
</style>
