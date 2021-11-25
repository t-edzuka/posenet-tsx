import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  CanvasRef,
  getSetVideoWH,
  isPoses,
  isWebcamRefValid,
  WebcamRef,
} from "../../utils/validations";
import { useMultiPoseNets } from "../../utils/hooks/useMultiPoseNet.ts";
import "@tensorflow/tfjs-backend-webgl";
import {
  drawMultiPerson,
  getCanvas2dCtx,
  setCanvasSizeFromWebcam,
} from "../../utils/draw/custom-draw";
import {BoxProps, videoConstraints, WebcamStyle} from "../../utils/params";
import { useIntervalWhen } from "rooks";
import { usePredClasses } from "../../utils/hooks/usePostPoses";
import { useMountedRef } from "../../utils/hooks/useMountedRef";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useCocoSsd } from "../../utils/hooks/useCocoSsd";
import Box from "@mui/material/Box";
import { useWebcamHandle } from "../../utils/hooks/useWebcamHandle";
import { HandleButton } from "../Buttons/HandleButton";
import WebcamWithSelect from "./WebcamWithSelect";

const CustomWebcam = () => {
  const webcamRef: WebcamRef = useRef(null);
  const canvasRef: CanvasRef = useRef(null);
  const cropRef: CanvasRef = useRef(null);
  const mounted = useMountedRef();
  const { model, loadPosenet, poses, setPoseEstimation } = useMultiPoseNets();
  const [prediction, setPrediction] = useState({});
  const [getSetPredHuman, drawBbox] = useCocoSsd();
  const [enablePlay, handlePlay] = useWebcamHandle();
  // const customPredict = useCustomPoseClassPredict();

  /*
      // Predict Pose class function
      async function predict(poseNetInput: PosenetInput) {
          const readyWebcamRef = getSetVideoWH(webcamRef);
          const result = await customPredict(poseNetInput);
          return result;
      }
  
      async function cropWebcam(pose: Pose | null, webcamRef: WebcamRef) {
          if (!pose) return;
          if (!isWebcamRefValid(webcamRef)) return;
          const {keypoints} = pose;
          const readyWebcamRef = getSetVideoWH(webcamRef);
  
          const cropped = await cropBoundingBox(keypoints, readyWebcamRef.current);
          return cropped as ImageData;
      }
  
      function multiPredict(poses:Pose[]) {
          const resultClassesArr = poses.map(async (pose) => {
              const imgData = await cropWebcam(pose, webcamRef);
              const resultClasses = imgData && await predict(imgData);
              return resultClasses
          });
          return resultClassesArr
      }
   */

  async function drawPose() {
    await setPoseEstimation(webcamRef, model);

    if (isPoses(poses) && canvasRef.current) {
      setCanvasSizeFromWebcam(webcamRef, canvasRef);
      const ctx = getCanvas2dCtx(canvasRef);
      drawMultiPerson(poses, 0.2, ctx);
    }
  }

  async function drawPersonBboxes() {
    setCanvasSizeFromWebcam(webcamRef, cropRef);
    const ctx = getCanvas2dCtx(cropRef);
    const readyWebcamRef = getSetVideoWH(webcamRef);
    if (!isWebcamRefValid(readyWebcamRef)) return;
    readyWebcamRef &&
      (await getSetPredHuman(
        readyWebcamRef.current?.video as HTMLVideoElement
      ));
    ctx && (await drawBbox(ctx));
  }

  useEffect(() => {
    void loadPosenet();
    console.log("Loaded model");
    return () => model?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, loadPosenet]);

  // Do estimation every xx ms, and draw poses on the video.
  useIntervalWhen(
    async () => {
      await drawPersonBboxes();
      await drawPose();
      // if (!poses) return;
      // const readyWebcamRef = getSetVideoWH(webcamRef);

      /*
                                const imgData = await cropWebcam(poses[0], readyWebcamRef);
                    
                                const _prediction = imgData && await predict(imgData);
                                setPrediction((_) => _prediction);
                    
                                if (cropRef.current && imgData) {
                                    const canvas = cropRef.current
                                    canvas.width = imgData?.width;
                                    canvas.height = imgData?.height;
                                    cropRef.current?.getContext("2d")?.putImageData(imgData, 0, 0);
                                }
                    
                                 */
    },
    150,
    mounted.current,
    false
  );

  const preds = usePredClasses(poses, 500);

  // usePostPoses(poses, 500);

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          mt: 2,
        }}
      >
        <Card
          sx={{
            position: "relative",
            width: "100%",
            height: 720,
            // textAlign: "center",
            // justifyContent: "center",
          }}
        >
          <CardContent>

            {enablePlay && <><Box sx={BoxProps as object}>
              <Webcam ref={webcamRef}
              videoConstraints={videoConstraints}
              style={WebcamStyle}
              />
            </Box>

            <Box sx={BoxProps as object}>
              <canvas ref={canvasRef} style={WebcamStyle} />
            </Box>
            <Box sx={BoxProps as object}>
              <canvas ref={cropRef} style={WebcamStyle} />
            </Box></>}
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12}>
        <Card
          sx={{}}
        >

            <Box>
              <CardContent>
                <Typography variant="h4" color="secondary" sx={{ pl: 4 }}>
                  推定姿勢:{" "}
                  {preds?.preds.map((pred: any, i: number) => {
                    return `${i + 1}人目 ${pred} `;
                  })}
                </Typography>
              </CardContent>
              <CardContent>
                <Typography variant="h4" color="secondary" sx={{ pl: 4 }}>
                  検出人数 {poses?.filter((pose) => pose.score >= 0.1).length}
                </Typography>
              </CardContent>
            </Box>

        </Card>
        <Card sx={{ m: 2 }}>
          <CardContent>
            <HandleButton enablePlay={enablePlay} onClick={handlePlay} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default CustomWebcam;
