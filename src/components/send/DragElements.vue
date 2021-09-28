<template>
    <div
            id="drag-icon"
            :style="{display: dragElementsDisplay,
            top: `${dragIconPos.y}px`, left: `${dragIconPos.x}px`}"
    >
        <ion-icon :icon="document"></ion-icon>
    </div>
    <div
            id="drag-backdrop"
            :style="{display: dragElementsDisplay}"
            @drop="drop"
            @dragenter="(event) => event.preventDefault()"
            @dragover="updateDragIcon"
    ></div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonIcon} from "@ionic/vue";
import {document} from "ionicons/icons";
import {mapMutations, mapState} from "vuex";
import {HIDE_DRAG_ELEMENTS, SET_DRAG_ICON_POS, SHOW_DRAG_ELEMENTS} from "@/store/actions";

import store from '@/store';

window.addEventListener('dragenter', (event: DragEvent) => {
    console.log("dragenter window")
    event.preventDefault();
    store.commit(SHOW_DRAG_ELEMENTS);
});

export default defineComponent({
    name: "DragElements",
    props: ['select'],
    computed: {
        ...mapState(['dragElementsDisplay', 'dragIconPos']),
    },
    methods: {
        ...mapMutations([HIDE_DRAG_ELEMENTS, SET_DRAG_ICON_POS]),
        drop(event: DragEvent) {
            event.preventDefault();
            this[HIDE_DRAG_ELEMENTS]();

            const files = event.dataTransfer!.files;
            if (files.length > 0) {
                // NB: only dropping first file in list.
                this.select(files[0]);
            } else {
                console.error("no files listed in drop event")
            }
        },
        updateDragIcon(event: DragEvent) {
            event.preventDefault();
            this[SET_DRAG_ICON_POS]({
                x: event.clientX + 5,
                y: event.clientY + 5,
            })
        },
    },
    components: {
        IonIcon,
    },
    setup() {
        return {
            document,
        }
    }
})
</script>

<style scoped lang="css">
ion-icon {
    width: 50px;
    height: 50px;
}

#drag-icon {
    position: absolute;
    display: none;
    pointer-events: none;
    z-index: 100;
}

#drag-backdrop {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 99;
    background: transparent;
    //background: rgba(255,255,255,.6);
}

</style>
