import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { CanvasRef, isPoses, WebcamRef } from "../../utils/validations";
import { useMultiPoseNets } from "../../utils/hooks/useMultiPoseNet.ts";
import "@tensorflow/tfjs-backend-webgl";
import {
  drawMultiPerson,
  getCanvas2dCtx,
  setCanvasSizeFromWebcam,
} from "../../utils/draw/custom-draw";
import { videoConstraints, WebcamStyle } from "../../utils/params";
import { useIntervalWhen, useWillUnmount } from "rooks";
import { usePostPoses } from "../../utils/hooks/usePostPoses";

const CustomWebcam = () => {
  const webcamRef: WebcamRef = useRef(null);
  const canvasRef: CanvasRef = useRef(null);
  const [mounted, setMount] = useState(true);
  const { model, loadPosenet, poses, setPoseEstimation } = useMultiPoseNets();

  function drawPose() {
    if (isPoses(poses) && canvasRef.current) {
      setCanvasSizeFromWebcam(webcamRef, canvasRef);
      const ctx = getCanvas2dCtx(canvasRef);
      drawMultiPerson(poses, 0.3, ctx);
    }
  }
  // 初回レンダリング時のみ実行 loadPosenet();
  useEffect(() => {
    void loadPosenet();
    return () => model?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Do estimation every xx ms, and draw poses on the video.
  useIntervalWhen(
    async () => {
      await setPoseEstimation(webcamRef, model);
      drawPose();
    },
    100,
    mounted,
    false
  );

  // usePostPoses(poses, 60000);
  useWillUnmount(() => {
    setMount((_) => false);
  });

  return (
    <>
      <Webcam
        ref={webcamRef}
        videoConstraints={videoConstraints}
        style={WebcamStyle}
      />
      <canvas ref={canvasRef} style={WebcamStyle} />
    </>
  );
};

export default CustomWebcam;
