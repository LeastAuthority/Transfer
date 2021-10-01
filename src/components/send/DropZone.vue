<template>
    <div class="flex-col drag-n-drop ion-justify-content-center"
         @drop="drop"
         @dragover="(event) => event.preventDefault()"
         @dragenter="dragEnter"
    >
        <div
                id="drag-icon"
                :style="{display: showDragElements ? 'block' : 'none',
                        top: `${dragIconPos.y - 15}px`, left: `${dragIconPos.x - 30}px`}"
        >
            <ion-icon :icon="document"></ion-icon>
        </div>
        <div
                id="drag-backdrop"
                class="relative"
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
            <div id="drag-content"
                 class="no-pointer-events flex ion-justify-content-center ion-align-items-center"
            >
                <ion-text>
                    <h1>Drop here!</h1>
                </ion-text>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonIcon, IonText} from "@ionic/vue";
import {document} from "ionicons/icons";
import {mapMutations, mapState} from "vuex";
import {HIDE_DRAG_ELEMENTS, SET_DRAG_ICON_POS, SHOW_DRAG_ELEMENTS} from "@/store/actions";

export default defineComponent({
    name: "DropZone",
    props: ['select', 'dropRef'],
    computed: {
        ...mapState(['showDragElements', 'dragIconPos']),
    },
    methods: {
        ...mapMutations([
            HIDE_DRAG_ELEMENTS,
            SHOW_DRAG_ELEMENTS,
            SET_DRAG_ICON_POS
        ]),
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
        dragEnter(event: DragEvent): void {
            event.preventDefault();
            console.log('dragEnter');
            this[SHOW_DRAG_ELEMENTS]();
        },
        dragOver(event: DragEvent) {
            event.preventDefault();
            this[SET_DRAG_ICON_POS]({
                x: event.offsetX,
                y: event.offsetY,
            });
        },
        dragLeave(event: DragEvent): void {
            event.preventDefault();
            this[HIDE_DRAG_ELEMENTS]();
        },
    },
    components: {
        IonIcon,
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


h1 {
//font-size: ;
}

#drag-content {
    width: 100%;
    height: 100%;
    white-space: nowrap;
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
