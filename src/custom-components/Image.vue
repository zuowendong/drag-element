<template>
  <div class="absolute overflow-hidden">
    <canvas ref="canvasRef" class="absolute"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useShapeStore } from "@/stores/shape";
import { useComponentStore } from "@/stores/component";

const props = defineProps({
  propsVal: {
    type: Object,
    default: () => {},
  },
  element: {
    type: Object,
    default: () => {},
  },
});

const canvasRef = ref();
const canvasCtx = ref();
const initWidth = ref(props.element.style.width);
const initHeight = ref(props.element.style.height);
const initLeft = ref(props.element.style.left);
const initTop = ref(props.element.style.top);

onMounted(() => {
  canvasCtx.value = canvasRef.value.getContext("2d");
  drawImage(initWidth.value, initHeight.value);
});

const isFirst = ref(true);
const imgDom = ref();

function drawImage(sWidth, sHeight, isBorder = true) {
  const { width, height } = props.element.style;
  canvasRef.value.width = width;
  canvasRef.value.height = height;

  if (isFirst.value) {
    isFirst.value = false;
    imgDom.value = document.createElement("img");
    imgDom.value.src = props.propsVal.url;
    imgDom.value.onload = () => {
      canvasCtx.value.drawImage(imgDom.value, 0, 0, width, height);
    };
  } else {
    if (isBorder) {
      canvasRef.value.width = initWidth.value;
      canvasRef.value.height = initHeight.value;
    }
    canvasCtx.value.drawImage(imgDom.value, 0, 0, sWidth, sHeight);
  }
}

const shapeStore = useShapeStore();
const componentStore = useComponentStore();
watch(
  () => ({
    isMove: shapeStore.isMoving,
    style: componentStore.curComponent?.style,
  }),
  ({ isMove, style }) => {
    if (isMove) {
      initWidth.value = componentStore.curComponent.style.width;
      initHeight.value = componentStore.curComponent.style.height;
      initLeft.value = componentStore.curComponent.style.left;
      initTop.value = componentStore.curComponent.style.top;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => ({
    width: props.element?.style.width,
    height: props.element?.style.height,
  }),
  (newVal, oldValue) => {
    if (newVal.width != oldValue.width && newVal.height != oldValue.height) {
      // change width & height
      drawImage(newVal.width, newVal.height, false);
    }
    if (
      newVal.width != oldValue.width &&
      newVal.height === oldValue.height &&
      (shapeStore.activeShapePoint === "l" || shapeStore.activeShapePoint === "r")
    ) {
      if (shapeStore.activeShapePoint === "l") {
        canvasRef.value.style.left = `${initLeft.value - props.element?.style.left}px`;
      }
      drawImage(initWidth.value, initHeight.value);
    }

    if (
      newVal.width === oldValue.width &&
      newVal.height != oldValue.height &&
      (shapeStore.activeShapePoint === "t" || shapeStore.activeShapePoint === "b")
    ) {
      if (shapeStore.activeShapePoint === "t") {
        canvasRef.value.style.top = `${initTop.value - props.element?.style.top}px`;
      }
      drawImage(initWidth.value, initHeight.value);
    }
  },
  { deep: true }
);
</script>
