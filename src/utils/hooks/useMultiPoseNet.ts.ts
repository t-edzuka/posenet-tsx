import { useCallback, useState } from "react";
import { useInterval } from "react-use";
import { estimationMultiConfig, modelConfig, poseFn } from "../params";

import "@tensorflow/tfjs-backend-webgl";
import * as posenet from "@tensorflow-models/posenet";
import { Pose, PoseNet } from "@tensorflow-models/posenet";
import {
  getSetVideoWH,
  isPoses,
  videoIsValid,
  WebcamRef,
} from "../validations";

export const calcMultiPersonPoses = async (
  webcamRef: WebcamRef,
  model: PoseNet | null
) => {
  if (!videoIsValid(webcamRef)) return null;
  if (!model) return null;
  const readyWebcamRef = getSetVideoWH(webcamRef);
  const video = readyWebcamRef?.current?.video as HTMLVideoElement;
  const poses = await model.estimateMultiplePoses(video, estimationMultiConfig);
  return poses;
};

export const useMultiPoseNets = () => {
  const [model, setModel] = useState<PoseNet | null>(null);
  const [poses, setPoses] = useState<Pose[] | null>(null);

  const loadPosenet = useCallback(async () => {
    const loadedModel = await posenet.load(modelConfig);
    setModel((_) => loadedModel);
    console.log("Posenet Model Loaded..");
  }, []);

  const setPoseEstimation =
    async (webcamRef: WebcamRef, model: PoseNet | null) => {
      const newPoses = await calcMultiPersonPoses(webcamRef, model);
      setPoses(newPoses ?? null);
    }

  return {
    model,
    loadPosenet,
    poses,
    setPoseEstimation,
  } as const;
};