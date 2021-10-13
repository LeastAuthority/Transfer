<template>
    <ion-card
            class="container"
            :style="{opacity}"
    >
        <ion-card-content class="ion-padding flex ion-justify-content-center ion-align-items-center">
            <ion-text color="black">
                {{ suggestedWord }}
            </ion-text>
            <ion-card color="light-grey" class="tab">
                <ion-card-content>
                    <ion-text color="darker-grey" class="ion-text-nowrap">
                        Press space to complete
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

export default defineComponent({
    name: "AutoComplete",
    computed: {
        ...mapState(['code', 'suggestedWord']),
        opacity(): number {
            return this.suggestedWord ? 1 : 0;
        }
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

    transition: opacity 250ms ease;
    pointer-events: none;
}

.tab {
    position: relative;
    margin: 0 0 0 10px !important;
}
</style>
