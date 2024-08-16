/**
 * eslint-disable max-lines-per-function
 *
 * @format
 */

import type { Vector } from "@shopify/react-native-skia";
import {
  Canvas,
  Group,
  Mask,
  Path,
  Rect,
  Skia,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, View } from "react-native";
import type { SvgProps } from "react-native-svg";
const defaultHexagonSize = 100;

export function makeHexagonPath(
  size: number,
  offset: [number, number] = [0, 0],
  cornerRadius: number = 2.5
) {
  const path = Skia.Path.Make();
  const [xOffset, yOffset] = offset;

  const halfed = size / 2;
  const sqrt = (Math.sqrt(3) * size) / 2;
  const points: [number, number][] = [
    [0, -sqrt], // top point
    [halfed, -halfed], // top right
    [halfed, halfed], // bottom right
    [0, sqrt], // bottom point
    [-halfed, halfed], // bottom left
    [-halfed, -halfed], // top left
  ].map(([x, y]) => [x * 1.6 + xOffset, y + yOffset] as [number, number]);

  const roundedPoints: [number, number][][] = points.map(([x, y], i) => {
    const [nextX, nextY] = points[(i + 1) % points.length];
    const dx = nextX - x;
    const dy = nextY - y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / len;
    const unitDy = dy / len;
    return [
      [x + unitDx * cornerRadius, y + unitDy * cornerRadius],
      [nextX - unitDx * cornerRadius, nextY - unitDy * cornerRadius],
    ];
  });

  path.moveTo(roundedPoints[0][0][0], roundedPoints[0][0][1]);
  roundedPoints.forEach(([start, end], i) => {
    const [cpX, cpY] = points[(i + 1) % points.length];
    path.lineTo(start[0], start[1]);
    path.quadTo(cpX, cpY, end[0], end[1]);
  });
  path.close();

  return path;
}

type HexagonProps = {
  hexagonSize?: number;
  hexagonColor?: string;
  hexagonPosition?: [number, number];
  fillPercentage?: number;
  active?: boolean;
  cornerRadius?: number;
  iconWidth?: number;
  iconHeight?: number;
  strokeWidth?: number;
  Icon?: React.FC<SvgProps>;
  ringColor?: string;
  activeColor?: string[];
  borderColor?: string[];
  fillColor?: string[];
};

const Hexagon: React.FC<HexagonProps> = ({
  hexagonSize = defaultHexagonSize,
  hexagonPosition = [0, 0],
  fillPercentage = 0.2,
  cornerRadius = 2.5,
  iconWidth,
  iconHeight,
  strokeWidth,
  Icon,
  ringColor,
  activeColor,
  borderColor = ["#6CE625", "#30E6FF"],
  fillColor = ["#489919", "#46bb04"],
}) => {
  const path = makeHexagonPath(
    hexagonSize,
    [hexagonSize + hexagonPosition[0], hexagonSize + hexagonPosition[1]],
    cornerRadius
  );
  const path2 = makeHexagonPath(
    hexagonSize - hexagonSize / 5,
    [hexagonSize + hexagonPosition[0], hexagonSize + hexagonPosition[1]],
    cornerRadius
  );

  // Calculate the dimensions based on hexagon size
  const hexagonWidth = hexagonSize * 2;
  const hexagonHeight = Math.sqrt(3) * hexagonSize * 2;
  const topLeftVec = vec(hexagonWidth / 12, hexagonHeight / 12);

  const createSweepGradient = (
    topLeftVector: Vector,
    colors: string[],
    rotateAngle = Math.PI / 5.45
  ) => (
    <SweepGradient
      c={topLeftVector}
      colors={colors}
      transform={[{ rotate: rotateAngle }]}
    />
  );

  const fill =
    fillPercentage <= 0.8
      ? fillPercentage + 1 - fillPercentage - 0.5 + fillPercentage / 2.5
      : fillPercentage >= 0.91 && fillPercentage !== 1
      ? 0.91
      : fillPercentage;

  const maskHeight = hexagonHeight * fill;

  return (
    <View className='z-20 flex flex-col items-center justify-center'>
      <Canvas style={{ width: hexagonWidth, height: hexagonHeight / 1.75 }}>
        {fillPercentage !== 0 && (
          <Group>
            {/* Grey Border Colors */}
            <Path path={path}>
              {createSweepGradient(topLeftVec, ["#63708A", "#8D9BB6"])}
            </Path>
            {/* Fill Inner Hexagon Colors */}
            <Path path={path2}>
              {createSweepGradient(topLeftVec, ["#313B4D", "#3F4B63"])}
            </Path>
          </Group>
        )}
        {fillPercentage === 0 ? (
          !activeColor ? (
            <Group>
              {/* Fill Border Colors */}

              <Path path={path}>
                {createSweepGradient(topLeftVec, ["#63708A", "#8D9BB6"])}
              </Path>
              {/* Fill Inner Hexagon Colors */}
              <Path path={path2}>
                {createSweepGradient(topLeftVec, ["#313B4D", "#3F4B63"])}
              </Path>
            </Group>
          ) : (
            <Group>
              {/* Fill Border Colors */}
              <Path
                path={makeHexagonPath(
                  hexagonSize,
                  [
                    hexagonSize + hexagonPosition[0],
                    hexagonSize + hexagonPosition[1],
                  ],
                  cornerRadius
                )}>
                {createSweepGradient(topLeftVec, [...activeColor])}
              </Path>
              <Path
                path={makeHexagonPath(
                  hexagonSize - hexagonSize / 10,
                  [
                    hexagonSize + hexagonPosition[0],
                    hexagonSize + hexagonPosition[1],
                  ],
                  cornerRadius
                )}>
                {createSweepGradient(topLeftVec, ["#63708A", "#8D9BB6"])}
              </Path>
              {/* Fill Inner Hexagon Colors */}
              <Path
                path={makeHexagonPath(
                  hexagonSize - hexagonSize / 5,
                  [
                    hexagonSize + hexagonPosition[0],
                    hexagonSize + hexagonPosition[1],
                  ],
                  cornerRadius
                )}>
                {createSweepGradient(topLeftVec, ["#313B4D", "#3F4B63"])}
              </Path>
            </Group>
          )
        ) : (
          <Mask
            mode='alpha'
            mask={
              <Rect
                x={0}
                y={hexagonHeight - maskHeight}
                width={hexagonWidth}
                height={hexagonHeight}
                color='white'
              />
            }>
            <Group>
              {/* Fill Border Colors */}
              <Path path={path}>
                {createSweepGradient(topLeftVec, borderColor)}
              </Path>
              {/* Fill Inner Hexagon Colors */}
              <Path path={path2}>
                {createSweepGradient(topLeftVec, fillColor)}
              </Path>
            </Group>
          </Mask>
        )}
      </Canvas>
      <View className='absolute'>
        {Icon && (
          <Icon
            width={iconWidth || Dimensions.get("window").height / 17}
            height={iconHeight || Dimensions.get("window").height / 17}
            strokeWidth={strokeWidth || 4}
            color={
              fillPercentage === 0 && (!activeColor || !ringColor)
                ? "#8D9BB6"
                : "#FFFFFF"
            }
          />
        )}
      </View>
      {ringColor && fillPercentage !== 1 && (
        <>
          <View
            className={`absolute  rounded-full border-2 border-dashed opacity-70`}
            style={{
              width: hexagonWidth + 5,
              height: hexagonWidth + 5,
              borderColor: ringColor,
            }}
          />
          <View
            className={`absolute  rounded-full border-2 border-dashed  opacity-30`}
            style={{
              width: hexagonWidth + 25,
              height: hexagonWidth + 25,
              borderColor: ringColor,
            }}
          />
        </>
      )}
    </View>
  );
};

export default Hexagon;
