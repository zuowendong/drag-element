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
import { useEditorStore } from "@/stores/editor";

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
const editorStore = useEditorStore();

// left-top  top  right-top  right  right-button  button  left-button  left
const pointList = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"];
const cursorPoints = computed(() => (props.active ? pointList : []));
const cursors = ref<any>([]);

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

function mod360(deg) {
  return (deg + 360) % 360;
}

// https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor
const initialAngle = ref({
  lt: 0,
  t: 45,
  rt: 90,
  r: 135,
  rb: 180,
  b: 225,
  lb: 270,
  l: 315,
});
const angleToCursor = ref([
  { start: 338, end: 23, cursor: "nw" },
  { start: 23, end: 68, cursor: "n" },
  { start: 68, end: 113, cursor: "ne" },
  { start: 113, end: 158, cursor: "e" },
  { start: 158, end: 203, cursor: "se" },
  { start: 203, end: 248, cursor: "s" },
  { start: 248, end: 293, cursor: "sw" },
  { start: 293, end: 338, cursor: "w" },
]);

function getCursor() {
  const curComponent = componentStore.curComponent;
  const rotate = mod360(curComponent.style.rotate); // 取余 360
  const result = {};
  let lastMatchIndex = -1;

  pointList.forEach((point) => {
    const angle = mod360(initialAngle.value[point] + rotate);
    const len = angleToCursor.value.length;
    while (true) {
      lastMatchIndex = (lastMatchIndex + 1) % len;
      const angleLimit = angleToCursor.value[lastMatchIndex];
      if (angle < 23 || angle >= 338) {
        result[point] = "nw-resize";
        return;
      }

      if (angleLimit.start <= angle && angle < angleLimit.end) {
        result[point] = `${angleLimit.cursor}-resize`;
        return;
      }
    }
  });

  return result;
}

function handleMouseDownOnShape(e) {
  e.preventDefault();
  e.stopPropagation();

  componentStore.setCurComponent(props.element, props.index);

  cursors.value = getCursor();

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

function handleMouseDownOnPoint(e, point) {
  e.stopPropagation();
  e.preventDefault();

  const style = { ...props.defaultStyle };
  // w/h
  const proportion = style.width / style.height;
  const center = {
    x: style.left + style.width / 2,
    y: style.top + style.height / 2,
  };

  const editorRectInfo = editorStore.editorRect as any;
  const pointRect = e.target.getBoundingClientRect();
  const curPoint = {
    x: Math.round(pointRect.left - editorRectInfo.left + e.target.offsetWidth / 2),
    y: Math.round(pointRect.top - editorRectInfo.top + e.target.offsetHeight / 2),
  };
  const symmetricPoint = {
    x: center.x - (curPoint.x - center.x),
    y: center.y - (curPoint.y - center.y),
  };
  console.log("point", proportion, symmetricPoint);

  let isFirst = true;
  const move = (moveEvent) => {
    if (isFirst) {
      isFirst = false;
      return;
    }
    const curPosition = {
      x: moveEvent.clientX - Math.round(editorRectInfo.left),
      y: moveEvent.clientY - Math.round(editorRectInfo.top),
    };

    console.log("move", curPosition);
  };

  const moveEnd = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", moveEnd);
  };

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", moveEnd);
}
</script>
