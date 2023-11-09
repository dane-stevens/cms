import { useState } from "react";

const bottom = ["#60a5fa", "#2563eb"];
const middle = ["#a78bfa", "#7c3aed"];
const top = ["#e879f9", "#c026d3"];

export function Logo({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="h-[24px] w-[48px]">
      <svg
        width="277"
        height="125"
        viewBox="0 0 277 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect
          x="7.62939e-06"
          y={`${isHovered ? "9" : "8"}6.4213`}
          width="277"
          height="13"
          fill={bottom[1]}
        />
        <rect
          width="140.637"
          height="140.637"
          transform={`matrix(0.984808 0.173648 -0.984808 0.173648 138.5 ${
            isHovered ? "8" : "7"
          }5.4213)`}
          fill={bottom[1]}
          className="transition-all duration-75"
        />
        <rect
          width="140.637"
          height="140.637"
          transform={`matrix(0.984808 0.173648 -0.984808 0.173648 138.5 ${
            isHovered ? "7" : "6"
          }2)`}
          fill={bottom[0]}
        />
        <rect
          x="7.62939e-06"
          y={`55.4213`}
          width="277"
          height="13"
          fill={middle[1]}
        />
        <rect
          width="140.637"
          height="140.637"
          transform={`matrix(0.984808 0.173648 -0.984808 0.173648 138.5 44.4213)`}
          fill={middle[1]}
        />
        <rect
          width="140.637"
          height="140.637"
          transform={`matrix(0.984808 0.173648 -0.984808 0.173648 138.5 31)`}
          fill={middle[0]}
        />
        <rect
          x="7.62939e-06"
          y={`${isHovered ? "1" : "2"}4.4213`}
          width="277"
          height="13"
          fill={top[1]}
        />
        <rect
          width="140.637"
          height="140.637"
          transform={`matrix(0.984808 0.173648 -0.984808 0.173648 138.5 ${
            isHovered ? "0" : "1"
          }3.4213)`}
          fill={top[1]}
        />
        <rect
          width="140.637"
          height="140.637"
          transform={`matrix(0.984808 0.173648 -0.984808 0.173648 138.5 ${
            isHovered ? "-10" : "0"
          })`}
          fill={top[0]}
        />
      </svg>
    </div>
  );
}
