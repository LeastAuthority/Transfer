<template>
    <!--    <transition name="step-fade">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title class="ion-padding-top ion-padding-horizontal">
                <ion-text class="bold" color="dark-grey">
                    Send files in real-time
                </ion-text>
            </ion-card-title>
            <ion-card-subtitle class="flex-col ion-align-items-start ion-padding-horizontal">
                <ion-text color="dark-grey">
                    We don’t store – <span class="italic">and can’t read</span> – your files.  We simply transfer them.
                </ion-text>
                <ion-text color="dark-grey">
                    No sign-ups. No snooping. No nonsense.
                </ion-text>
            </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="ion-text-center">
            <DropZone class="ion-hide-sm-down"
                      :select="select">
                <div>
                    <div class="flex-col ion-margin-vertical">
                        <ion-text color="dark-grey" class="bold">
                            Drag & drop any file
                        </ion-text>
                        <ion-text color="dark-grey" style="font-weight: 400;">
                            up to 4GB
                        </ion-text>
                    </div>
                    <div class="ion-margin-bottom">
                        <ion-text color="dark-grey" class="bold">
                            or
                        </ion-text>
                    </div>
                    <ion-button class="large-button ion-margin-vertical"
                                color="medium-grey"
                                @click="() => select()">
                        <ion-icon slot="icon-only" src="/assets/icon/select.svg"></ion-icon>
                    </ion-button>
                </div>
            </DropZone>
            <ion-button class="large-button ion-margin-bottom"
                        color="medium-grey"
                        @click="() => select()">
                <ion-icon slot="icon-only" src="/assets/icon/select_mobile.svg"></ion-icon>
            </ion-button>
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

import DropZone from "@/components/send/DropZone.vue";

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
        DropZone,
    },
    methods: {},
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
</style>
