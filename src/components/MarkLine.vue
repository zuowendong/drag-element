<template>
  <div v-for="line in lines" :key="line">
    <div
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
      showLine(state.x, state.y);
    } else {
      // console.log(5555);
      // hiddenLine();
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
function showLine(isRightward: boolean, isDownward: boolean) {
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
    componentStore.setShapeSingleStyle("top", targetY);
  }

  if (isNearly(curCompStyle.top + curCompHalfHeight, targetY)) {
    lineStates.value = {
      ...lineStates.value,
      lx: true,
    };
    componentStore.setShapeSingleStyle("top", targetY - curCompHalfHeight);
  }

  if (isNearly(curCompStyle.top + curCompStyle.height, targetY)) {
    lineStates.value = {
      ...lineStates.value,
      lx: true,
    };
    componentStore.setShapeSingleStyle("top", targetY - curCompStyle.height);
  }

  if (isNearly(curCompStyle.left, targetX)) {
    lineStates.value = {
      ...lineStates.value,
      ly: true,
    };
    componentStore.setShapeSingleStyle("left", targetX);
  }

  if (isNearly(curCompStyle.left + curCompHalfWidth, targetX)) {
    lineStates.value = {
      ...lineStates.value,
      ly: true,
    };
    componentStore.setShapeSingleStyle("left", targetX - curCompHalfWidth);
  }

  if (isNearly(curCompStyle.left + curCompStyle.width, targetX)) {
    lineStates.value = {
      ...lineStates.value,
      ly: true,
    };
    componentStore.setShapeSingleStyle("left", targetX - curCompStyle.width);
  }
}
</script>
