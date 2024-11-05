import { ref } from "vue";
import { defineStore } from "pinia";

export const useShapeStore = defineStore("shape", () => {
  const activeShapePoint = ref("");
  function setActivePoint(point: string) {
    activeShapePoint.value = point;
  }

  const isMoving = ref(false);
  function shapeMove() {
    isMoving.value = true;
  }
  function shapeMoveEnd() {
    isMoving.value = false;
  }

  const hasChangeShapeStyle = ref(false);
  function changeShapeStyle() {
    hasChangeShapeStyle.value = true;
  }
  function overChangeShapeStyle() {
    hasChangeShapeStyle.value = false;
  }

  return {
    activeShapePoint,
    setActivePoint,
    isMoving,
    shapeMove,
    shapeMoveEnd,
    hasChangeShapeStyle,
    changeShapeStyle,
    overChangeShapeStyle,
  };
});
