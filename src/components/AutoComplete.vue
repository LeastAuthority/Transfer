<template>
    <ion-card class="container flex ion-justify-content-center ion-align-items-center">
        <ion-card-content class="ion-padding">
            <ion-text>
                {{ suggestedWord }}
            </ion-text>
            <ion-card color="medium" class="tab">
                <ion-card-content>
                    <ion-text>
                        Tab ->|
                    </ion-text>
                </ion-card-content>
            </ion-card>
        </ion-card-content>
    </ion-card>
</template>

<script lang="ts">
import {
    IonCard,
    IonCardContent,
    IonText,
} from '@ionic/vue';
import {defineComponent} from "vue";
import {mapState} from "vuex";

import {CodePredictor} from "@/wordlist/wordlist";

const predictor = new CodePredictor();

export default defineComponent({
    name: "AutoComplete",
    computed: {
        ...mapState(['code']),
        suggestedWord(): string {
            return predictor.nearestNextWord(this.code);
        },
    },
    components: {
        IonCard,
        IonCardContent,
        IonText,
    }
});
</script>

<style scoped>
.container {
    position: absolute;
    margin: 0 auto !important;
    left: 0;
    right: 0;
}

.tab {
    position: relative;
    width: 75px;
    margin: 0 0 0 10px !important;
}
</style>
