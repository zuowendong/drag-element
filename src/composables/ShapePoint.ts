import { ref } from "vue";

function mod360(deg) {
  return (deg + 360) % 360;
}

export function useShapePoints() {
  const cursors = ref<any>([]);

  // https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor
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

  function setPointStyle(style, point) {
    const { width, height } = style;
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
      width: point.length === 1 && (hasT || hasB) ? "16px" : "8px",
      height: point.length === 1 && (hasL || hasR) ? "16px" : "8px",
      borderRadius: point.length === 2 ? "50%" : "6px",
      marginLeft: point.length === 1 && (hasT || hasB) ? "-8px" : "-4px",
      marginTop: point.length === 1 && (hasL || hasR) ? "-8px" : "-4px",
      left: `${newLeft}px`,
      top: `${newTop}px`,
      cursor: cursors.value[point],
    };
  }

  function setCursor(curComponent, pointList) {
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

  return {
    cursors,
    setPointStyle,
    setCursor,
  };
}
