import { drawKeypoints, drawSkeleton } from "./draw";
import { Pose } from "@tensorflow-models/posenet";
import { isContext2D, isPose, isPoses } from "../validations";

export const drawSinglePerson = (
  pose: Pose | null | undefined,
  minConfidence: number,
  ctx: CanvasRenderingContext2D | null,
  scale = 1
) => {
  if (isContext2D(ctx) && isPose(pose)) {
    drawKeypoints(pose.keypoints, minConfidence, ctx, scale);
    drawSkeleton(pose.keypoints, minConfidence, ctx, scale);
  }
};

export const drawMultiPerson = (
  poses: Pose[] | null | undefined,
  minConfidence: number,
  ctx: CanvasRenderingContext2D | null,
  scale = 1
) => {
  if (isContext2D(ctx) && isPoses(poses)) {
    poses.forEach((pose) => drawSinglePerson(pose, minConfidence, ctx, scale));
  }
};