<template>
    <ion-content class="ion-padding">
        {{suggestedWord}}
    </ion-content>
</template>

<script lang="ts">
import {IonContent} from '@ionic/vue';
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
        IonContent,
    }
});
</script>

<style scoped>

</style>
