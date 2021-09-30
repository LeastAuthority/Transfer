<template>
<!--    <div-->
<!--            id="drag-icon"-->
<!--            :style="{display: dragElementsDisplay,-->
<!--            top: `${dragIconPos.y}px`, left: `${dragIconPos.x}px`}"-->
<!--    >-->
<!--        <ion-icon :icon="document"></ion-icon>-->
<!--    </div>-->
    <div
            id="drag-backdrop"
            :style="{
                // display: showDragElements ? 'block' : 'none',
                width: showDragElements ? '100%' : 0,
                height: showDragElements ? '100%' : 0,
                ['border-radius']: showDragElements ? 0 : '10000px',
            }"
            @drop="drop"
            @dragover="dragOver"
            @dragleave="dragLeave"
    >
        <ion-text>
            <h1>Drop here!</h1>
        </ion-text>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonIcon,IonText} from "@ionic/vue";
import {document} from "ionicons/icons";
import {mapMutations, mapState} from "vuex";
import {HIDE_DRAG_ELEMENTS, SET_DRAG_ICON_POS, SHOW_DRAG_ELEMENTS} from "@/store/actions";

import store from '@/store';

function windowDragEnter (event: DragEvent): void {
    event.preventDefault();
    store.commit(SHOW_DRAG_ELEMENTS);
}
window.addEventListener('dragenter', windowDragEnter);
// TODO: window.removeEventListener('dragenter', windowDragEnter);

export default defineComponent({
    name: "DragElements",
    props: ['select'],
    computed: {
        ...mapState(['showDragElements', 'dragIconPos']),
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
        dragOver(event: DragEvent) {
            event.preventDefault();
            // this[SET_DRAG_ICON_POS]({
            //     x: event.clientX + 5,
            //     y: event.clientY + 5,
            // });
        },
        // dragEnter(event: DragEvent): void {
        //     event.preventDefault();
        //     this[SHOW_DRAG_ELEMENTS]();
        // },
        dragLeave(event: DragEvent): void {
            event.preventDefault();
            // delayed hide
        },
    },
    components: {
        // IonIcon,
        IonText,
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
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    overflow: hidden;
    border-radius: 10000px;
    transition: width 250ms ease, height 250ms ease, border-radius 300ms ease;
    z-index: 99;
    background: var(--ion-color-yellow);
}

</style>
