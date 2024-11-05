import { ref } from "vue";
import { defineStore } from "pinia";

export const useShapeStore = defineStore("shape", () => {
  const activeShapePoint = ref("");

  function setActivePoint(point: string) {
    activeShapePoint.value = point;
  }
  return {
    activeShapePoint,
    setActivePoint,
  };
});
