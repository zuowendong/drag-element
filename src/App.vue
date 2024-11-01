<template>
  <main class="w-full h-screen flex flex-col">
    <header class="w-full h-14 flex items-center justify-center border-b border-[#ccc]">FEI CUT EXAM</header>
    <section class="w-full flex-1 grid grid-cols-[200px_auto_200px]">
      <div class="">
        <!-- components -->
      </div>
      <div class="bg-white border-l border-r border-[#ccc]">
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
</script>

<style scoped></style>
