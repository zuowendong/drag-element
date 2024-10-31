<template>
  <div
    class="absolute"
    :class="{
      'outline outline-1 outline-[#59c7f9]': active,
    }"
    @mousedown="handleMouseDownOnShape"
  >
    <div
      v-for="item in cursorPoints"
      :key="item"
      class="absolute w-[8px] h-[8px] bg-white border border-[#59c7f9] rounded-[50%] z-10"
      :style="getPointStyle(item)"
      @mousedown="(e) => handleMouseDownOnPoint(e, item)"
    ></div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useComponentStore } from "@/stores/component";

const props = defineProps({
  element: {
    type: Object,
    default: () => {},
  },
  defaultStyle: {
    type: Object,
    default: () => {},
  },
  index: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const componentStore = useComponentStore();

function handleMouseDownOnShape(e) {
  e.preventDefault();
  e.stopPropagation();

  componentStore.setCurComponent(props.element, props.index);

  let pos = { ...props.defaultStyle };
  const startY = e.clientY;
  const startX = e.clientX;
  const startTop = Number(pos.top);
  const startLeft = Number(pos.left);

  const move = (moveEvent) => {
    const curX = moveEvent.clientX;
    const curY = moveEvent.clientY;
    pos.top = curY - startY + startTop;
    pos.left = curX - startX + startLeft;

    componentStore.setShapeStyle({
      width: pos.width,
      height: pos.height,
      top: pos.top,
      left: pos.left,
      rotate: 0,
    });
  };
  const moveEnd = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", moveEnd);
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", moveEnd);
}

// left-top  top  right-top  right  right-button  button  left-button  left
const pointList = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"];
const cursorPoints = computed(() => (props.active ? pointList : []));
const cursors = ref([]);

function getPointStyle(point) {
  const { width, height } = props.defaultStyle;
  const hasT = /t/.test(point);
  const hasB = /b/.test(point);
  const hasL = /l/.test(point);
  const hasR = /r/.test(point);
  let newLeft = 0;
  let newTop = 0;
  // lt rt rb lb
  if (point.length === 2) {
    newLeft = hasL ? 0 : width;
    newTop = hasT ? 0 : height;
  } else {
    // t b
    if (hasT || hasB) {
      newLeft = width / 2;
      newTop = hasT ? 0 : height;
    }
    // l r
    if (hasL || hasR) {
      newLeft = hasL ? 0 : width;
      newTop = Math.floor(height / 2);
    }
  }
  return {
    marginLeft: "-4px",
    marginTop: "-4px",
    left: `${newLeft}px`,
    top: `${newTop}px`,
    cursor: cursors.value[point],
  };
}

function handleMouseDownOnPoint(e, point) {}
</script>
