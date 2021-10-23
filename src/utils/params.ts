import {ModelConfig, MultiPersonInferenceConfig, Pose, SinglePersonInterfaceConfig} from "@tensorflow-models/posenet";

type VideoSize = {
  width: number;
  height: number;
};

type WebcamStyle = VideoSize & {
    marginTop: `${number}px`;
    marginBottom: `${number}px`;
    marginLeft: "auto";
    marginRight: "auto";
    left: number;
    right: number;
    textAlign: "center";
    zindex: number;
    position?: "absolute";
}

export type poseFn = (pose: Pose | null | undefined) => void;
export type posesFn = (poses: Pose[] | null | undefined) => void;

export const VideoSize: VideoSize = {
    width: 640,
    height: 480,
};

export const WebcamStyle: WebcamStyle = {
    marginTop: "10px",
    marginBottom: "10px",
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: "center",
    position: "absolute",
    zindex: 9,
    ...VideoSize
};

export const modelConfig: ModelConfig = {
  architecture: "MobileNetV1",
  outputStride: 16,
  inputResolution: { width: VideoSize.width, height: VideoSize.height },
  multiplier: 0.75,
};



// export const modelConfig: ModelConfig = {
//     architecture: "ResNet50",
//     outputStride: 32,
//     inputResolution: { width: VideoSize.width, height: VideoSize.height },
// };
export const estimationConfig: SinglePersonInterfaceConfig = {
  flipHorizontal: false,
};

export const estimationMultiConfig : MultiPersonInferenceConfig = {
    flipHorizontal: false,
    maxDetections: 5,
    scoreThreshold: 0.5,
    nmsRadius: 20,
}