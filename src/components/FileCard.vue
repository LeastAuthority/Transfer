<template>
    <ion-card>
        <ion-icon :icon="document"></ion-icon>
        <ion-text color="black"
                  class="bold ellipsis-overflow ion-text-nowrap"
        >
            {{ name }}
        </ion-text>
        <ion-text color="black"
                  class="ion-text-nowrap">
            ({{ sizeWithUnit }})
        </ion-text>
    </ion-card>
</template>

<script lang="ts">

import {IonCard, IonIcon, IonText} from "@ionic/vue";
import {document} from 'ionicons/icons';
import {FileMeta} from "@/store";
import {sizeToClosestUnit} from "@/util";
import {defineComponent} from "vue";

export default defineComponent({
    name: "FileCard",
    props: ['name', 'size'],
    computed: {
        sizeWithUnit(): string {
            return sizeToClosestUnit(this.size);
        },
    },
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
})
</script>

<style lang="css" scoped>
:root ion-card {
    --padding: 0 15.4px;
    height: 36px;
}

.ellipsis-overflow {
    text-overflow: ellipsis;
    overflow: hidden;
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
    margin-left: 6px;
}

ion-card > *:first-child {
    margin-left: initial;
}

ion-icon {
    font-size: 18px;
}

ion-text {
    font-size: 14px;
    font-weight: 500;
}
</style>
