<template>
  <div class="relative text-black">
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
        :style="getStyle(item.style)"
        :element="item"
        :index="index"
      ></component>
    </ShapeBox>
  </div>
</template>

<script setup lang="ts">
import ShapeBox from "./ShapeBox.vue";
import { useComponentStore } from "@/stores/component";
import { getShapeStyle, getStyle } from "@/utils/style";

const componentStore = useComponentStore();
</script>
