import { getCenterPoint, calculateRotatedPointCoordinate } from "@/utils/translate";

function calculateTop(style, curPosition, pointInfo) {
  const { symmetricPoint, curPoint } = pointInfo;

  const rotatedCurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -style.rotate);
  const rotatedTopMiddlePoint = calculateRotatedPointCoordinate(
    { x: curPoint.x, y: rotatedCurPosition.y },
    curPoint,
    style.rotate
  );

  const newHeight = Math.sqrt(
    (rotatedTopMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedTopMiddlePoint.y - symmetricPoint.y) ** 2
  );

  const newCenter = {
    x: rotatedTopMiddlePoint.x - (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
    y: rotatedTopMiddlePoint.y + (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2,
  };

  style.height = Math.round(newHeight);
  style.top = Math.round(newCenter.y - newHeight / 2);
  style.left = Math.round(newCenter.x - style.width / 2);
}

function calculateBottom(style, curPosition, pointInfo) {
  const { symmetricPoint, curPoint } = pointInfo;
  const rotatedCurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -style.rotate);
  const rotatedBottomMiddlePoint = calculateRotatedPointCoordinate(
    { x: curPoint.x, y: rotatedCurPosition.y },
    curPoint,
    style.rotate
  );

  const newHeight = Math.sqrt(
    (rotatedBottomMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedBottomMiddlePoint.y - symmetricPoint.y) ** 2
  );

  const newCenter = {
    x: rotatedBottomMiddlePoint.x - (rotatedBottomMiddlePoint.x - symmetricPoint.x) / 2,
    y: rotatedBottomMiddlePoint.y + (symmetricPoint.y - rotatedBottomMiddlePoint.y) / 2,
  };

  style.height = Math.round(newHeight);
  style.top = Math.round(newCenter.y - newHeight / 2);
  style.left = Math.round(newCenter.x - style.width / 2);
}

function calculateLeft(style, curPosition, pointInfo) {
  const { symmetricPoint, curPoint } = pointInfo;
  const rotatedCurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -style.rotate);
  const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate(
    { x: rotatedCurPosition.x, y: curPoint.y },
    curPoint,
    style.rotate
  );

  const newWidth = Math.sqrt(
    (rotatedLeftMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedLeftMiddlePoint.y - symmetricPoint.y) ** 2
  );

  const newCenter = {
    x: rotatedLeftMiddlePoint.x - (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
    y: rotatedLeftMiddlePoint.y + (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2,
  };

  style.width = Math.round(newWidth);
  style.top = Math.round(newCenter.y - style.height / 2);
  style.left = Math.round(newCenter.x - newWidth / 2);
}

function calculateRight(style, curPosition, pointInfo) {
  const { symmetricPoint, curPoint } = pointInfo;
  const rotatedCurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -style.rotate);
  const rotatedRightMiddlePoint = calculateRotatedPointCoordinate(
    { x: rotatedCurPosition.x, y: curPoint.y },
    curPoint,
    style.rotate
  );

  const newWidth = Math.sqrt(
    (rotatedRightMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedRightMiddlePoint.y - symmetricPoint.y) ** 2
  );

  const newCenter = {
    x: rotatedRightMiddlePoint.x - (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
    y: rotatedRightMiddlePoint.y + (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2,
  };

  style.width = Math.round(newWidth);
  style.top = Math.round(newCenter.y - style.height / 2);
  style.left = Math.round(newCenter.x - newWidth / 2);
}

export function useShapePositionAndSize() {
  return {
    calculateTop,
    calculateBottom,
    calculateLeft,
    calculateRight,
  };
}
