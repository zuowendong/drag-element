import { sin, cos } from "./translate";

const needSUnit = ["width", "height", "top", "left", "rotate"];
const needTUnit = ["fontSize", "width", "height", "top", "left"];

export function getShapeStyle(style) {
  const result: any = {};
  needSUnit.forEach((attr) => {
    if (attr === "rotate") {
      result.transform = `rotate(${style[attr]}deg)`;
    } else {
      result[attr] = `${style[attr]}px`;
    }
  });
  return result;
}

export function getComponentStyle(style) {
  const result: any = {};
  Object.keys(style).forEach((key) => {
    if (!needSUnit.includes(key)) {
      if (key == "rotate") {
        result.transform = `${key}(${style[key]}deg)`;
      } else {
        if (style[key] !== "") {
          result[key] = style[key];

          if (needTUnit.includes(key)) {
            result[key] += "px";
          }
        }
      }
    }
  });

  return result;
}

export function getCompRotatedStyle(style) {
  style = { ...style };
  if (style.rotate != 0) {
    const newWidth = style.width * cos(style.rotate) + style.height * sin(style.rotate);
    const diffX = (style.width - newWidth) / 2; // 旋转后范围变小是正值，变大是负值
    style.left += diffX;
    style.right = style.left + newWidth;

    const newHeight = style.height * cos(style.rotate) + style.width * sin(style.rotate);
    const diffY = (newHeight - style.height) / 2; // 始终是正
    style.top -= diffY;
    style.bottom = style.top + newHeight;

    style.width = newWidth;
    style.height = newHeight;
  } else {
    style.bottom = style.top + style.height;
    style.right = style.left + style.width;
  }

  return style;
}
