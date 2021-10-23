import React from "react";
import Webcam from "react-webcam";
import { Pose } from "@tensorflow-models/posenet";

export type WebcamRef = React.MutableRefObject<Webcam | null>;

export const videoExists = (
  webcamRef: any
): webcamRef is WebcamRef => {
  return webcamRef && webcamRef.current && webcamRef.current.video;
};

export const videoIsReady = (
  video: HTMLVideoElement | null | undefined
): video is HTMLVideoElement => {
  return video?.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA; // equal to 4
};

export const videoIsValid = (webcamRef: WebcamRef) => {
  return videoExists(webcamRef) && videoIsReady(webcamRef?.current?.video);
};

/**
 @param video: HTMLVideoElement
 */
export function getVideoSize(video: HTMLVideoElement) {
  return { videoWidth: video.videoWidth, videoHeight: video.videoHeight };
}

// setup video property to pass the estimate function;
export const getSetVideoWH = (webcamRef: WebcamRef) => {
  if (videoIsValid(webcamRef)) {
    const { videoWidth, videoHeight } = getVideoSize(
      webcamRef?.current?.video as HTMLVideoElement
    );
    (webcamRef?.current?.video as HTMLVideoElement).width = videoWidth;
    (webcamRef?.current?.video as HTMLVideoElement).height = videoHeight;
    return webcamRef;
  } else {
    return webcamRef;
  }
};


export const isPose = (pose: any): pose is Pose => {
  if (pose) {
    return "keypoints" in pose
  } else {
    return false;
  }
};

export function isPoses(poses: any): poses is Pose[] {
  if (!poses || poses.length < 1) {
    return false;
  }
  return isPose(poses[0]);
}

export const isContext2D = (ctx: any): ctx is CanvasRenderingContext2D => {
  return !!(ctx as CanvasRenderingContext2D);
};