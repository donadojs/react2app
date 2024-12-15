import React, { useEffect, useState } from "react";
import styles from "./ThoughtBubble.module.css";

type DotsPosition = "right" | "left" | "top" | "bottom";
type BubbleSize = "sm" | "md" | "lg";
type DotDirection = "up" | "down" | "left" | "right" | null;
type DotCurve = "up" | "down" | null;

interface ThoughtBubbleProps {
  title?: string;
  description?: string;
  emoji?: string;
  size?: BubbleSize;
  dotsPosition?: DotsPosition;
  dotDirection?: DotDirection;
  dotCurve?: DotCurve;
}

const ThoughtBubble = ({
  title,
  description = "Thinking...",
  emoji = "💭",
  size = "md",
  dotsPosition = "right",
  dotDirection = "right",
  dotCurve = null,
}: ThoughtBubbleProps) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "p-5 text-sm",
    md: "p-6 text-base",
    lg: "p-7 text-lg",
  };

  const dotsPositionClasses = {
    right:
      "top-1/2 -translate-y-1/2 -translate-x-1 left-full flex-row gap-4 ml-6",
    left: "top-1/2 -translate-y-1/2 translate-x-1 right-full flex-row gap-4 mr-6",
    top: "left-1/2 -translate-x-1/2 translate-y-1 bottom-full flex-col gap-4 mb-6",
    bottom:
      "left-1/2 -translate-x-1/2 -translate-y-1 top-full flex-col gap-4 mt-6",
  };

  const getDotClasses = (index: number) => {
    const baseClasses = `bg-white rounded-full border-2 border-gray-200 shadow-sm ${styles["cloud-fade"]}`;
    const sizes = ["w-6 h-6", "w-5 h-5", "w-4 h-4"];
    const animations = [
      "animate-[bounce_2s_ease-in-out_infinite]",
      "animate-[bounce_2s_ease-in-out_infinite_0.2s]",
      "animate-[bounce_2s_ease-in-out_infinite_0.4s]",
    ];

    const classes = [
      baseClasses,
      sizes[index],
      animations[index],
      dotDirection ? styles[`dot-direction-${dotDirection}`] : "",
      dotCurve ? styles[`dot-curve-${dotCurve}-${index}`] : "",
    ].filter(Boolean);

    return classes.join(" ");
  };

  return (
    <div className="relative inline-block">
      {/* Main thought bubble */}
      <div
        className={`${styles["thought-bubble"]} ${
          styles["cloud-fade"]
        } bg-white rounded-[40px] shadow-lg ${sizeClasses[size]}`}
      >
        <div className="flex flex-col gap-2">
          {title && (
            <div className="flex items-center gap-4">
              <span className="text-4xl">{emoji}</span>
              <h3 className="font-semibold text-xl">{title}</h3>
            </div>
          )}
          <p className="text-gray-700">
            {description}
            <span className="inline-block w-6">{dots}</span>
          </p>
        </div>
      </div>

      {/* Bubble dots with fade effect */}
      <div className={`absolute flex ${dotsPositionClasses[dotsPosition]}`}>
        {[0, 1, 2].map((index) => (
          <div key={index} className={getDotClasses(index)} />
        ))}
      </div>
    </div>
  );
};

export default ThoughtBubble;
