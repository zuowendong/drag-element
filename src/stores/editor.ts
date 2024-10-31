import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useEditorStore = defineStore("editor", () => {
  const editorRect = ref({});

  function setEditorRect(editor) {
    editorRect.value = editor.value.getBoundingClientRect();
  }

  return {
    editorRect,
    setEditorRect,
  };
});
