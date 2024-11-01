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
