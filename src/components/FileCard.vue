<template>
    <ion-card>
        <ion-icon :icon="document"></ion-icon>
        <ion-text>{{ filename }}</ion-text>
    </ion-card>
</template>

<script lang="ts">

import {IonCard, IonIcon, IonText} from "@ionic/vue";
import {document} from 'ionicons/icons';

export default {
    name: "FileCard",
    props: ['filename'],
    components: {
        IonCard,
        IonIcon,
        IonText,
    },
    setup() {
        return {
            document,
        }
    },
}
</script>

<style lang="css" scoped>
:root ion-card {
    --padding: 0 15.4px;
    height: 36px;
}

ion-card {
    /* TODO: be more specific with main ion-card selector and delete this */
    min-height: initial !important;
    box-shadow: none;
    border: 1px solid var(--ion-color-medium-grey);

    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: var(--padding);
}

ion-card > * {
    padding-left: calc(var(--padding) / 2);
}

ion-card > *:first-child {
    padding-left: initial;
}

ion-icon {
    font-size: 18px;
    padding-right: 6px;
}

ion-text {
    font-size: 14px;
    font-weight: 500;
}
</style>
