<template>
  <div
    ref="shapeBoxRef"
    class="absolute"
    :class="{
      'outline outline-1 outline-[#1677ff]': active,
    }"
    @mousedown="handleMouseDownOnShape"
  >
    <div
      v-for="item in cursorPoints"
      :key="item"
      class="absolute w-[8px] h-[8px] bg-white border border-[#1677ff] rounded-[50%] z-10 hover:bg-[#fadb14] hover:border-[#fadb14]"
      :style="getPointStyle(item)"
      @mousedown="(e) => handleMouseDownOnPoint(e, item)"
    ></div>

    <slot></slot>

    <img v-show="active" class="rotateIcon" src="/rotate.png" alt="rotate" @mousedown="handleRotate" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import { useComponentStore } from "@/stores/component";
import { useEditorStore } from "@/stores/editor";
import { useShapePositionAndSize } from "@/composables/shapePositionSize";
import { useShapePoints } from "@/composables/ShapePoint";
import { useShapeStore } from "@/stores/shapeMove";

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
const shapeStore = useShapeStore();

// left-top  top  right-top  right  right-bottom  bottom  left-bottom  left
const pointList = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"];
const cursorPoints = computed(() => (props.active ? pointList : []));

const { cursors, setPointStyle, setCursor } = useShapePoints();

function getPointStyle(point) {
  return setPointStyle(props.defaultStyle, point);
}

function getCursor() {
  return setCursor(componentStore.curComponent, pointList);
}

const {
  calculateTop,
  calculateBottom,
  calculateLeft,
  calculateRight,
  calculateLeftTop,
  calculateRightTop,
  calculateLeftBottom,
  calculateRightBottom,
} = useShapePositionAndSize();

function handleMouseDownOnShape(e) {
  componentStore.setCompChooseState(true);

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

    nextTick(() => {
      shapeStore.shapeMove(curX - startX > 0, curY - startY > 0);
    });
  };
  const moveEnd = () => {
    shapeStore.shapeMoveEnd();
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", moveEnd);
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", moveEnd);
}

function handleMouseDownOnPoint(e, point) {
  componentStore.setCompChooseState(true);

  e.stopPropagation();
  e.preventDefault();

  const style = { ...props.defaultStyle };
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

    switch (point) {
      case "t":
        calculateTop(style, curPosition, { center, curPoint, symmetricPoint });
        break;
      case "b":
        calculateBottom(style, curPosition, { center, curPoint, symmetricPoint });
        break;
      case "l":
        calculateLeft(style, curPosition, { center, curPoint, symmetricPoint });
        break;
      case "r":
        calculateRight(style, curPosition, { center, curPoint, symmetricPoint });
        break;
      case "lt":
        calculateLeftTop(style, curPosition, { center, curPoint, symmetricPoint });
        break;
      case "rt":
        calculateRightTop(style, curPosition, { center, curPoint, symmetricPoint });
        break;
      case "lb":
        calculateLeftBottom(style, curPosition, { center, curPoint, symmetricPoint });
        break;
      case "rb":
        calculateRightBottom(style, curPosition, { center, curPoint, symmetricPoint });
        break;

      default:
        break;
    }

    componentStore.setShapeStyle({
      width: style.width,
      height: style.height,
      top: style.top,
      left: style.left,
      rotate: style.rotate,
    });
  };

  const moveEnd = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", moveEnd);
  };

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", moveEnd);
}

const shapeBoxRef = ref();
function handleRotate(e) {
  componentStore.setCompChooseState(true);

  e.preventDefault();
  e.stopPropagation();

  const pos = { ...props.defaultStyle };
  const startY = e.clientY;
  const startX = e.clientX;
  const startRotate = pos.rotate;

  const shapeRectInfo = shapeBoxRef.value.getBoundingClientRect();
  const centerX = shapeRectInfo.left + shapeRectInfo.width / 2;
  const centerY = shapeRectInfo.top + shapeRectInfo.height / 2;

  const rotateDegreeBefore = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);

  const move = (moveEvent) => {
    const curX = moveEvent.clientX;
    const curY = moveEvent.clientY;
    const rotateDegreeAfter = Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180);
    pos.rotate = startRotate + rotateDegreeAfter - rotateDegreeBefore;

    componentStore.setShapeStyle({
      width: pos.width,
      height: pos.height,
      top: pos.top,
      left: pos.left,
      rotate: pos.rotate,
    });
  };

  const moveEnd = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", moveEnd);
    cursors.value = getCursor();
  };

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", moveEnd);
}
</script>

<style scoped>
.rotateIcon {
  @apply w-[20px] h-[20px] absolute bottom-[-40px] left-[50%] translate-x-[-50%] cursor-grab active:cursor-grabbing;
}
</style>
