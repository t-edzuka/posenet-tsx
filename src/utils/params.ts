import {
  ModelConfig,
  MultiPersonInferenceConfig,
  Pose,
  SinglePersonInterfaceConfig,
} from "@tensorflow-models/posenet";

type VideoSize = {
  width: number;
  height: number;
};

type WebcamStyle = VideoSize & {
  // marginTop: `${number}px`;
  // marginBottom: `${number}px`;
  marginLeft: "auto";
  marginRight: "auto";
  left: number;
  right: number;
  textAlign: "center";
  // zindex: number;
  position?: "absolute";
};

export type poseFn = (pose: Pose | null | undefined) => void;
export type posesFn = (poses: Pose[] | null | undefined) => void;

export const VideoSize: VideoSize = {
  width: 1440,
  height: 700,
};

export const WebcamStyle: WebcamStyle = {
  // marginTop: "10px",
  // marginBottom: "10px",
  marginLeft: "auto",
  marginRight: "auto",
  left: 0,
  right: 0,
  textAlign: "center",
  position: "absolute",
  // zindex: 9,
  ...VideoSize,
};

export const videoConstraints: MediaTrackConstraints = {
  ...VideoSize,
  // facingMode: 'user',
  deviceId: "b68fad05d6e40173c664286398d516a7e50556e93ab2d650fbdd278eb8bc909a"
};
// b68fad05d6e40173c664286398d516a7e50556e93ab2d650fbdd278eb8bc909a 内蔵
// ee94b2475b46981f8b130bb99eeb33dc47b4e5396ea113f4e2132d4149112119
export const BoxProps = {
  position: "absolute",
  zIndex: "tooltip",
  left: 0,
  right: 0,
  // marginLeft: "auto",
  // marginRight: "auto",

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

export const estimationMultiConfig: MultiPersonInferenceConfig = {
  flipHorizontal: false,
  maxDetections: 10,
  scoreThreshold: 0.5,
  nmsRadius: 30,
};

export const wholeBodyScoreThreshold = 0.2;

export const URL = "http://localhost:8081/poses/";
export const PredURL = "http://localhost:8081/prediction/";
export type MetaData = {
  cameraId: string;
  houseId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
};
export const sampleMetaData = {
  cameraId: "cam-001",
  houseId: "oyama-1",
  location: {
    latitude: 34.7,
    longitude: 137.9,
  },
  description: "oyama sample camera data",
};
export type PoseData = {
  poses: Pose[];
  date: string;
  farmwork: string[];
  poseClass: string[];
};