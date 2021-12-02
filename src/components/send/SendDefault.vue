<template>
    <Card :active="active">
        <template #title>
            <ion-text class="bold" color="dark-grey">
                Send files in real-time
            </ion-text>
        </template>
        <template #subtitle>
            <p>
                <ion-text color="dark-grey" class="ion-text-nowrap">
                  We don’t store
                </ion-text>
                <ion-text color="dark-grey">
                  – <span class="italic">and can’t read</span> – your files.
                </ion-text>
                <ion-text color="dark-grey" class="conditional-wrap">
                    We simply transfer them.
                </ion-text>
            </p>
            <p>
                <ion-text color="dark-grey">
                    No sign-ups. No snooping. No nonsense.
                </ion-text>
            </p>
        </template>
        <template #content>
            <DropZone class="show-desktop"
                      :select="select">
                <div class="ion-text-center">
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
            <ion-button class="large-button ion-margin-bottom hide-desktop"
                        color="medium-grey"
                        @click="() => select()">
                <ion-icon slot="icon-only" src="/assets/icon/select_mobile.svg"></ion-icon>
            </ion-button>
        </template>
    </Card>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {
    IonButton,
    IonIcon,
    IonText
} from "@ionic/vue";

import Card from "@/components/Card.vue";
import DropZone from "@/components/send/DropZone.vue";

export default defineComponent({
    name: "SendDefault",
    props: ['select', 'active'],
    components: {
        IonButton,
        IonIcon,
        IonText,
        Card,
        DropZone,
    },
    methods: {},
});
</script>


<style lang="css" scoped>
.hide-desktop {
    display: none;
}

@media screen and (max-height: 520px) {
    .show-desktop {
        display: none !important;
    }

    .hide-desktop {
        display: initial;
    }
}

@media screen and (max-width: 575px) {
    .show-desktop {
        display: none !important;
    }

    .hide-desktop {
        display: initial;
    }
}

/* TODO: use ion- classes instead where possible */
.flex-col {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
//justify-content: space-around; align-items: center;
}

.conditional-wrap {
    white-space: nowrap;
}

@media screen and (max-width: 435px) {
    .conditional-wrap {
        white-space: initial;
    }
}
</style>
