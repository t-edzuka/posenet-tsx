import { useCallback, useState } from "react";
import {getSetVideoWH, isWebcamRef, isWebcamRefValid, WebcamRef} from "../validations";
import { estimationConfig, modelConfig } from "../params";

import "@tensorflow/tfjs-backend-webgl";
import * as posenet from "@tensorflow-models/posenet";
import { Pose, PoseNet } from "@tensorflow-models/posenet";

const calcSinglePoseEstimation = async (
  webcamRef: WebcamRef,
  model: PoseNet
) => {
  if (!isWebcamRef(webcamRef)) return null;
  if (!model) return null;
  if (!isWebcamRefValid(webcamRef)) return null;

  const readyWebcamRef = getSetVideoWH(webcamRef);
  const video = readyWebcamRef?.current?.video as HTMLVideoElement;
  const pose = await model.estimateSinglePose(video, estimationConfig);
  return pose;
};

export const useSinglePoseNet = () => {

  const [model, setModel] = useState<PoseNet | null>(null);
  const [pose, setPose] = useState<Pose | null>(null);

  const loadPosenet = useCallback(async () => {
    const loadedModel = await posenet.load(modelConfig);
    setModel(loadedModel);
    console.log("Posenet Model Loaded..");
  }, []);

  const setPoseEstimation =
    async (webcamRef: WebcamRef, model: PoseNet) => {
      const newPose = await calcSinglePoseEstimation(webcamRef, model);
      setPose((_) => newPose);
    }


  return {
    model,
    loadPosenet,
    pose,
    setPoseEstimation,
  } as const;
};
