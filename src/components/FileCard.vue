<template>
    <ion-card>
        <ion-spinner v-show="basename === ''" name="dots"></ion-spinner>
        <ion-icon v-show="basename !== ''" :icon="document"></ion-icon>
        <ion-text v-show="basename !== ''" color="black"
                  class="bold ellipsis-overflow ion-text-nowrap"
        >
            {{ basename }}
        </ion-text>
        <ion-text v-show="basename !== ''" color="black"
                  class="no-margin bold ion-text-nowrap">
            .{{ extension }}
        </ion-text>
        <ion-text v-show="basename !== ''" color="black"
                  class="ion-text-nowrap">
            ({{ sizeWithUnit }})
        </ion-text>
    </ion-card>
</template>

<script lang="ts">

import {IonCard, IonIcon, IonSpinner, IonText} from "@ionic/vue";
import {document} from 'ionicons/icons';
import {sizeToClosestUnit} from "@/util";
import {defineComponent} from "vue";

export default defineComponent({
    name: "FileCard",
    props: ['name', 'size'],
    computed: {
        basename(): string {
            if (typeof (this.name) === 'undefined') {
                return '';
            }

            return this.name
                    .split('.')
                    .filter((part: string) => part !== this.extension)
                    .join('.');
        },
        extension(): string {
            if (typeof (this.name) === 'undefined') {
                return '';
            }

            return this.name
                    .split('.')
                    .reverse()[0];
        },
        sizeWithUnit(): string {
            return sizeToClosestUnit(this.size);
        },
    },
    components: {
        IonCard,
        IonIcon,
        IonText,
        IonSpinner,
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
