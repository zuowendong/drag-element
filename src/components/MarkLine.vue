<template>
  <div class="h-full">
    <div
      v-for="line in lines"
      :key="line"
      v-show="lineStates[line]"
      class="absolute bg-[#59c7f9] z-50"
      :class="{
        'w-full h-[1px] top-[50%] translate-y-[-50%]': isXLine(line),
        'w-[1px] h-full left-[50%] translate-x-[-50%]': !isXLine(line),
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useShapeStore } from "@/stores/shapeMove";
import { useComponentStore } from "@/stores/component";
import { getCompRotatedStyle } from "@/utils/style";
import { useEditorStore } from "@/stores/editor";

const lines = ref(["lx", "ly"]);
function isXLine(line: string) {
  return line.includes("x");
}

const lineStates = ref({
  lx: false,
  ly: false,
});

const shapeStore = useShapeStore();
watch(
  () => ({
    state: shapeStore.shapeMoveState,
    isMove: shapeStore.isMoving,
  }),
  ({ state, isMove }) => {
    if (isMove) {
      showLine();
    } else {
      hiddenLine();
    }
  },
  {
    deep: true,
  }
);

function hiddenLine() {
  Object.keys(lineStates.value).forEach((key) => {
    lineStates.value[key] = false;
  });
}

const diff = 20;
function isNearly(dragValue, targetValue) {
  return Math.abs(dragValue - targetValue) <= diff;
}

const componentStore = useComponentStore();
const editorStore = useEditorStore();

function showLine() {
  const curCompStyle = getCompRotatedStyle(componentStore.curComponent.style);
  const curCompHalfWidth = curCompStyle.width / 2;
  const curCompHalfHeight = curCompStyle.height / 2;

  const targetRect = editorStore.editorRect;
  const targetX = targetRect.width / 2;
  const targetY = targetRect.height / 2;

  hiddenLine();

  if (isNearly(curCompStyle.top, targetY)) {
    lineStates.value = {
      ...lineStates.value,
      lx: true,
    };
    const value = curCompStyle.rotate != 0 ? translateCurComponentPos("top", targetY, curCompStyle) : targetY;
    componentStore.setShapeSingleStyle("top", value);
  }

  if (isNearly(curCompStyle.top + curCompHalfHeight, targetY)) {
    lineStates.value = {
      ...lineStates.value,
      lx: true,
    };
    const value =
      curCompStyle.rotate != 0
        ? translateCurComponentPos("top", targetY - curCompHalfHeight, curCompStyle)
        : targetY - curCompHalfHeight;
    componentStore.setShapeSingleStyle("top", value);
  }

  if (isNearly(curCompStyle.top + curCompStyle.height, targetY)) {
    lineStates.value = {
      ...lineStates.value,
      lx: true,
    };
    const value =
      curCompStyle.rotate != 0
        ? translateCurComponentPos("top", targetY - curCompStyle.height, curCompStyle)
        : targetY - curCompStyle.height;
    componentStore.setShapeSingleStyle("top", value);
  }

  if (isNearly(curCompStyle.left, targetX)) {
    lineStates.value = {
      ...lineStates.value,
      ly: true,
    };
    const value = curCompStyle.rotate != 0 ? translateCurComponentPos("left", targetX, curCompStyle) : targetX;
    componentStore.setShapeSingleStyle("left", value);
  }

  if (isNearly(curCompStyle.left + curCompHalfWidth, targetX)) {
    lineStates.value = {
      ...lineStates.value,
      ly: true,
    };
    const value =
      curCompStyle.rotate != 0
        ? translateCurComponentPos("left", targetX - curCompHalfWidth, curCompStyle)
        : targetX - curCompHalfWidth;
    componentStore.setShapeSingleStyle("left", value);
  }

  if (isNearly(curCompStyle.left + curCompStyle.width, targetX)) {
    lineStates.value = {
      ...lineStates.value,
      ly: true,
    };
    const value =
      curCompStyle.rotate != 0
        ? translateCurComponentPos("left", targetX - curCompStyle.width, curCompStyle)
        : targetX - curCompStyle.width;
    componentStore.setShapeSingleStyle("left", value);
  }
}

function translateCurComponentPos(key, pos, curCompStyle) {
  const { width, height } = componentStore.curComponent.style;
  if (key === "top") {
    return Math.round(pos - (height - curCompStyle.height) / 2);
  } else if (key === "left") {
    return Math.round(pos - (width - curCompStyle.width) / 2);
  }
}
</script>
