import { useCallback, useState } from "react";
import { estimationMultiConfig, modelConfig } from "../params";

import "@tensorflow/tfjs-backend-webgl";
import * as posenet from "@tensorflow-models/posenet";
import { Pose, PoseNet } from "@tensorflow-models/posenet";
import {
  getSetVideoWH,
  isWebcamRef, isWebcamRefValid,
  WebcamRef,
} from "../validations";

export const calcMultiPersonPoses = async (
  webcamRef: WebcamRef,
  model: PoseNet | null
) => {
  if (!isWebcamRef(webcamRef)) return null;
  if (!model) return null;

  // この操作は必須
  const readyWebcamRef = getSetVideoWH(webcamRef);

  // isWebcamRefValid で videoがHTMLVideoElementかつ十分なデータがある状態になることを保証する
  if (isWebcamRefValid(readyWebcamRef)) {
    const poses = await model.estimateMultiplePoses(
      readyWebcamRef?.current?.video as HTMLVideoElement,
      estimationMultiConfig
    );
    return poses;
  } else {
    return null;
  }
};

export const useMultiPoseNets = () => {
  const [model, setModel] = useState<PoseNet | null>(null);
  const [poses, setPoses] = useState<Pose[] | null>(null);

  const loadPosenet = useCallback(async () => {
    const loadedModel = await posenet.load(modelConfig);
    setModel((_) => loadedModel);
    console.log("Posenet Model Loaded..");
  }, []);

  const setPoseEstimation = async (
    webcamRef: WebcamRef,
    model: PoseNet | null
  ) => {
    const newPoses = await calcMultiPersonPoses(webcamRef, model);
    setPoses(newPoses);
  };

  return {
    model,
    loadPosenet,
    poses,
    setPoseEstimation,
  } as const;
};