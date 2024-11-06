import { ref } from "vue";
import { defineStore } from "pinia";
import { IMAGE_COMPONENT } from "@/mock/component";

export const useComponentStore = defineStore("component", () => {
  const componentData = ref([{ ...JSON.parse(JSON.stringify(IMAGE_COMPONENT)) }]);
  const curComponent = ref<any>(null);
  const curComponentIndex = ref<number | null>(null);

  function setCurComponent(component, index) {
    curComponent.value = component;
    curComponentIndex.value = index;
  }

  function setShapeStyle({ top, left, width, height, rotate }) {
    if (top !== undefined) curComponent.value.style.top = Math.round(top);
    if (left !== undefined) curComponent.value.style.left = Math.round(left);
    if (width) curComponent.value.style.width = Math.round(width);
    if (height) curComponent.value.style.height = Math.round(height);
    if (rotate) curComponent.value.style.rotate = Math.round(rotate);
  }

  const isChosenComponent = ref(false);
  function setCompChooseState(state: boolean) {
    isChosenComponent.value = state;
  }

  function setShapeSingleStyle(key, value) {
    curComponent.value.style[key] = value;
  }

  function resetCompRotate() {
    curComponent.value.style.rotate = 0;
  }
  function resetComponentStyle() {
    curComponent.value.style = { ...IMAGE_COMPONENT.style };
  }

  return {
    componentData,
    curComponent,
    setCurComponent,
    setShapeStyle,
    isChosenComponent,
    setCompChooseState,
    setShapeSingleStyle,
    resetCompRotate,
    resetComponentStyle,
  };
});
