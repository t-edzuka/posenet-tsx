import React from "react";
import Webcam from "react-webcam";
import { Pose } from "@tensorflow-models/posenet";

export type WebcamRef = React.MutableRefObject<Webcam | null>;
export type CanvasRef = React.MutableRefObject<HTMLCanvasElement | null>;

export const isWebcamRef = (webcamRef: any): webcamRef is React.MutableRefObject<Webcam>  => {
  return isRef(webcamRef) && isWebcam(webcamRef.current);
};

export const isWebcam = (webcam: any): webcam is Webcam => {
  return webcam instanceof Webcam;
};

export const isHTMLVideo = (video: any): video is HTMLVideoElement => {
  return video instanceof HTMLVideoElement;
};

export const isVideoReady = (video: HTMLVideoElement) => {
  return video.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA; // equal to 4
};

export const isWebcamRefValid = (webcamRef: WebcamRef)  => {
  return (
    isWebcamRef(webcamRef) &&
    isWebcam(webcamRef.current) &&
    isHTMLVideo(webcamRef.current.video) &&
    isVideoReady(webcamRef.current.video)
  );
};

export function getVideoSize(
  video: HTMLVideoElement | WebcamRef | null | undefined
) {
  if (!video) return [null, null] as const;
  if (isWebcamRef(video) && isWebcam(video.current) && isHTMLVideo(video.current.video)) {
    return [
      video.current.video?.videoWidth,
      video.current.video?.videoHeight,
    ] as const;
  } else if (!isWebcamRef(video) && isHTMLVideo(video)) {
    return [video.videoWidth, video.videoHeight] as const;
  } else {
    return [null, null] as const;
  }
}

// setup video property to pass the estimate function;
export const getSetVideoWH = (webcamRef: WebcamRef) => {
  if (
    isWebcam(webcamRef.current) &&
    isHTMLVideo(webcamRef.current.video) &&
    isVideoReady(webcamRef.current.video)
  ) {
    const [videoWidth, videoHeight] = getVideoSize(webcamRef.current.video);
    webcamRef.current.video.width = videoWidth ?? 0;
    webcamRef.current.video.height = videoHeight ?? 0;
    return webcamRef;
  } else {
    return webcamRef;
  }
};

export const isPose = (pose: any): pose is Pose => {
  if (pose) {
    return "keypoints" in pose;
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

export const isCanvas = (canvas: any): canvas is HTMLCanvasElement => {
  return canvas instanceof HTMLCanvasElement;
};

interface T {}

export const isRef = (ref: any): ref is React.MutableRefObject<T> => {
  if (!ref) return false;
  return "current" in ref;
};

export const isCanvasRef = (
  canvasRef: any
): canvasRef is React.MutableRefObject<HTMLCanvasElement> => {
  return isRef(canvasRef) && isCanvas(canvasRef.current);
};
