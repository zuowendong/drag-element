export function getCenterPoint(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
}

/**
 *
 * @param point 旋转前的点坐标
 * @param center 旋转中心
 * @param rotate 旋转的角度
 * @returns 旋转后的坐标
 */
export function calculateRotatedPointCoordinate(point, center, rotate) {
  return {
    x:
      (point.x - center.x) * Math.cos(angleToRadian(rotate)) -
      (point.y - center.y) * Math.sin(angleToRadian(rotate)) +
      center.x,
    y:
      (point.x - center.x) * Math.sin(angleToRadian(rotate)) +
      (point.y - center.y) * Math.cos(angleToRadian(rotate)) +
      center.y,
  };
}

function angleToRadian(angle) {
  return (angle * Math.PI) / 180;
}
export function sin(rotate) {
  return Math.abs(Math.sin(angleToRadian(rotate)));
}

export function cos(rotate) {
  return Math.abs(Math.cos(angleToRadian(rotate)));
}
