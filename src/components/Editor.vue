<template>
  <div ref="editorRef" class="w-full h-full relative text-black">
    <ShapeBox
      v-for="(item, index) in componentStore.componentData"
      :key="item.id"
      :default-style="item.style"
      :style="getShapeStyle(item.style)"
      :element="item"
      :active="item.id === componentStore.curComponent?.id"
    >
      <component
        :is="item.key"
        :id="'component' + item.id"
        :style="getComponentStyle(item.style)"
        class="w-full h-full outline-none"
        :element="item"
        :props-val="item.propsVal"
        :index="index"
      ></component>
    </ShapeBox>

    <MarkLine />
  </div>
</template>

<script setup lang="ts">
import ShapeBox from "./ShapeBox.vue";
import { useComponentStore } from "@/stores/component";
import { useEditorStore } from "@/stores/editor";
import { getShapeStyle, getComponentStyle } from "@/utils/style";
import { onMounted, ref } from "vue";
import MarkLine from "./MarkLine.vue";

const componentStore = useComponentStore();
const editorStore = useEditorStore();
const editorRef = ref();

onMounted(() => {
  editorStore.setEditorRect(editorRef);
});
</script>
