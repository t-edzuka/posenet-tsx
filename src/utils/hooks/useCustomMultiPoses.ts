import {useCallback, useEffect, useState} from "react";
import * as tmPose from "@teachablemachine/pose";
import { PosenetInput } from "@tensorflow-models/posenet/dist/types";

export function useCustomPoseClassPredict() {
  const [customPoseNet, setModel] = useState<null | tmPose.CustomPoseNet>(null);

  useEffect(() => {
    const loadCustomPoseNet = async () => {
      const _customPoseNet = await tmPose.load(
        "/my-pose-model_3/model.json",
        "/my-pose-model_3/metadata.json"
      );
      setModel((_) => _customPoseNet);
    };
    void loadCustomPoseNet();
    return () => setModel((_) => null);
  }, []);

  const customPredict = useCallback(async (posenetInput: PosenetInput) => {
    if (!customPoseNet) return;
    const { heatmapScores, offsets, displacementFwd, displacementBwd } =
      await customPoseNet.estimatePoseOutputs(posenetInput);
    const posenetOutput = customPoseNet.poseOutputsToAray(
      heatmapScores,
      offsets,
      displacementFwd,
      displacementBwd
    );
    const resultClasses = await customPoseNet.predict(posenetOutput);
    return resultClasses;
  }, [customPoseNet]);
  return customPredict;
}
