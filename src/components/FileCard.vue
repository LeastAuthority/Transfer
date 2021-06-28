<template>
    <ion-card>
        <ion-spinner v-show="basename === ''" name="dots"></ion-spinner>
        <ion-icon v-show="basename !== ''" :icon="document"></ion-icon>
        <ion-text v-show="basename !== ''" color="black"
                  class="basename bold ellipsis-overflow ion-text-nowrap"
        >
            {{ basename(name) }}
        </ion-text>
        <ion-text v-show="basename(name) !== ''" color="black"
                  class="extension no-margin bold ion-text-nowrap">
            .{{ extension(name) }}
        </ion-text>
        <ion-text v-show="basename(name) !== ''" color="black"
                  class="size ion-text-nowrap">
            ({{ sizeWithUnit(size) }})
        </ion-text>
    </ion-card>
</template>

<script lang="ts">

import {IonCard, IonIcon, IonSpinner, IonText} from "@ionic/vue";
import {document} from 'ionicons/icons';
import {basename, extension, sizeWithUnit} from "@/util";
import {defineComponent} from "vue";

export default defineComponent({
    name: "FileCard",
    props: ['name', 'size'],
    components: {
        IonCard,
        IonIcon,
        IonText,
        IonSpinner,
    },
    setup() {
        return {
            document,
            basename,
            extension,
            sizeWithUnit,
        }
    },
})
</script>

<style lang="css" scoped>
:root ion-card {
    --padding: 0 15.4px;
    height: 36px;
}

.no-margin {
    margin-left: 0;
}

.ellipsis-overflow {
    text-overflow: ellipsis;
    overflow: hidden;
}

ion-spinner {
    margin-top: 5px;
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

ion-card  > * {
    margin-left: 6px;
}

ion-card  > *:first-child {
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
