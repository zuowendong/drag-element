import { ref } from "vue";
import { defineStore } from "pinia";

export const useShapeStore = defineStore("shape", () => {
  const shapeMoveState = ref({
    x: false, // true 表示向右移动 false 表示向左移动
    y: false, // true 表示向下移动 false 表示向上移动
  });
  const isMoving = ref(false);

  function shapeMove(xState: boolean, yState: boolean) {
    isMoving.value = true;
    shapeMoveState.value = {
      x: xState,
      y: yState,
    };
  }
  function shapeMoveEnd() {
    isMoving.value = false;
  }

  return {
    shapeMoveState,
    shapeMove,
    isMoving,
    shapeMoveEnd,
  };
});
