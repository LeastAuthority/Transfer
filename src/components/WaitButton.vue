<template>
    <ion-button :class="{'copy-button': true, waiting}"
                :color="color"
                @click="_click"
                :disabled="waiting">
        <slot v-if="waiting" name="waiting-text"></slot>
        <slot v-else name="text"></slot>
    </ion-button>
</template>

<style scoped lang="css">
ion-button::part(native) {
    /*transition: background-color .3s ease;*/
    transition: background-color .5s ease;
}
</style>

<script lang="ts">
import {defineComponent} from 'vue';

import {IonButton} from '@ionic/vue';

export default defineComponent({
    name: 'WaitButton',
    props: ['text', 'waitingText', 'click'],
    data() {
        return {
            waiting: false,
        }
    },
    computed: {
        color() {
            return this.waiting ?
                    'light-yellow' : 'yellow';
        },
    },
    methods: {
        _click(): void {
            window.setTimeout(() => {
                this.waiting = false;
            }, 5000);
            this.waiting = true;
            this.click();
        }
    },
    components: {
        IonButton,
    },
})
</script>
