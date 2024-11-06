<template>
  <main class="w-full h-screen flex flex-col">
    <header class="w-full h-14 flex items-center justify-center border-b border-[#ccc] relative">
      <span>FEI CUT EXAM</span>

      <div
        class="absolute right-[100px] px-[10px] py-[4px] border border-[#333] rounded-lg hover:bg-[#59c7f9] hover:border-[#59c7f9] hover:text-white cursor-pointer"
        @click="componentStore.resetCompRotate"
      >
        reset rotate
      </div>
      <div
        class="absolute right-[20px] px-[10px] py-[4px] border border-[#333] rounded-lg hover:bg-[#59c7f9] hover:border-[#59c7f9] hover:text-white cursor-pointer"
        @click="componentStore.resetComponentStyle"
      >
        reset all
      </div>
    </header>
    <section class="w-full flex-1 grid grid-cols-[200px_auto_200px]">
      <div class="">
        <!-- components -->
      </div>
      <div
        class="bg-white border-l border-r border-[#ccc] overflow-hidden"
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
