<template>
  <div style="overflow: hidden">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

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

onMounted(() => {
  canvasCtx.value = canvasRef.value.getContext("2d");
  drawImage();
});

const isFirst = ref(true);
const imgDom = ref();

function drawImage() {
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
    canvasCtx.value.drawImage(imgDom.value, 0, 0, width, height);
  }
}

watch(
  () => ({
    width: props.element?.style.width,
    height: props.element?.style.height,
  }),
  (newVal, oldValue) => {
    if (newVal.width != oldValue.width && newVal.height != oldValue.height) {
      // change width & height
      drawImage();
    }
  },
  { deep: true }
);
</script>
