<template>
  <main class="w-full h-screen flex flex-col">
    <header class="w-full h-14 flex items-center justify-center border-b border-[#ccc]">FEI CUT EXAM</header>
    <section class="w-full flex-1 grid grid-cols-[200px_auto_200px]">
      <div class="">
        <!-- components -->
      </div>
      <div
        class="bg-white border-l border-r border-[#ccc]"
        @mousedown="handleMouseDown"
        @mouseup="deselectCurComponent"
      >
        <Editor />
      </div>
      <div>
        <!-- attrs -->
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import Editor from "./components/Editor.vue";
import { useComponentStore } from "@/stores/component";

const componentStore = useComponentStore();

function handleMouseDown(e) {
  e.stopPropagation();
  componentStore.setCompChooseState(false);
}
function deselectCurComponent() {
  if (!componentStore.isChosenComponent) {
    componentStore.setCurComponent(null, null);
  }
}
</script>

<style scoped></style>
