import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { CanvasRef, isPoses, WebcamRef } from "../../utils/validations";
import { useMultiPoseNets } from "../../utils/hooks/useMultiPoseNet.ts";
import "@tensorflow/tfjs-backend-webgl";
import {
  drawMultiPerson,
  getCanvas2dCtx,
  setCanvasSizeFromWebcam,
} from "../../utils/draw/custom-draw";
import { WebcamStyle } from "../../utils/params";
import { useInterval } from "react-use";

const CustomWebcam = () => {
  const webcamRef: WebcamRef = useRef(null);
  const canvasRef: CanvasRef = useRef(null);
  const { model, loadPosenet, poses, setPoseEstimation } = useMultiPoseNets();
  // 初回レンダリング時のみ実行 loadPosenet();
  useEffect(() => {
    void loadPosenet();
    return () => model?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Do estimation every xx ms, and draw poses on the video.
  useInterval(async () => {
    await setPoseEstimation(webcamRef, model);
    if (isPoses(poses) && canvasRef.current) {
      setCanvasSizeFromWebcam(webcamRef, canvasRef);
      const ctx = getCanvas2dCtx(canvasRef);
      drawMultiPerson(poses, 0.3, ctx);
    }
  }, 100);

  return (
    <>
      <Webcam ref={webcamRef} style={WebcamStyle} />
      <canvas ref={canvasRef} style={WebcamStyle} />
    </>
  );
};

export default CustomWebcam;
