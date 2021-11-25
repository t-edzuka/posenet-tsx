import React from "react";
import { clearCanvas } from "../draw/custom-draw";

export const useWebcamHandle = (
  canvasRef?: React.MutableRefObject<HTMLCanvasElement | null | undefined>
) => {
  const [enablePlay, setEnablePlay] = React.useState(true);

  const handlePlay = () => {
    setEnablePlay((prev) => !prev);
    clearCanvas(canvasRef);
  };
  return [enablePlay, handlePlay] as const;
};
