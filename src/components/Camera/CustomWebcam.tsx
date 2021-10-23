import React, {useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import {getSetVideoWH, getVideoSize, isContext2D, isPoses, videoIsValid, WebcamRef} from "../../utils/validations";
import {calcMultiPersonPoses, useMultiPoseNets} from "../../utils/hooks/useMultiPoseNet.ts";
import {Pose} from "@tensorflow-models/posenet";
import "@tensorflow/tfjs-backend-webgl";
import {drawSinglePerson} from "../../utils/draw/custom-draw.ts";
import {WebcamStyle} from "../../utils/params";
import {useInterval} from "react-use";

const CustomWebcam = () => {
    const webcamRef: WebcamRef = useRef(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // const [imgUrl, setImgUrl] = useState("");
    // const imgRef = useRef<HTMLImageElement | null>(null);

    const {model, loadPosenet, poses, setPoseEstimation} = useMultiPoseNets();

    // const drawPose = (pose: Pose | null | undefined) => {
    //     if (!videoIsValid(webcamRef)) return;
    //     if (canvasRef.current && pose) {
    //         const readyWebcamRef = getSetVideoWH(webcamRef)
    //         const {videoWidth, videoHeight} = getVideoSize(
    //             readyWebcamRef?.current?.video as HTMLVideoElement
    //         );
    //         canvasRef.current.width = videoWidth;
    //         canvasRef.current.height = videoHeight;
    //         const ctx = canvasRef.current.getContext("2d");
    //         drawSinglePerson(pose, 0.5, ctx, 1);
    //     }
    // };

    // const capture = () => {
    //     if (videoIsValid(webcamRef)) {
    //         const imgB64 = webcamRef.current?.getScreenshot();
    //         setImgUrl((prev) => imgB64 ?? "");
    //     }
    // };

    // const onLoadEstimation = async () => {
    //     if (webcamRef && webcamRef.current && webcamRef.current && canvasRef.current) {
    //         const readyWebcamRef = getSetVideoWH(webcamRef);
    //         const poses = await model?.estimateMultiplePoses(readyWebcamRef.current?.video as HTMLVideoElement );
    //
    //         const {videoWidth, videoHeight} = getVideoSize(
    //             webcamRef?.current?.video as HTMLVideoElement
    //         );
    //         canvasRef.current.width = videoWidth;
    //         canvasRef.current.height = videoHeight;
    //         const ctx = canvasRef.current?.getContext("2d");
    //
    //         if (ctx && poses) {
    //             ctx.fillStyle = "rgb( 0, 0, 0)";
    //             ctx.beginPath();
    //             ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //             poses.forEach((pose) => drawSinglePerson(pose, 0.2, ctx));
    //         }
    //
    //         console.log(poses);
    //     } else {
    //         console.log("Poses do not exists");
    //     }
    // };

    useEffect(() => {
        void loadPosenet();
        return () => model?.dispose();
    }, []);

    // useIntervalPoseEstimation(webcamRef, drawPose, 100);
    // useInterval(async () => {
    //     const newPoses = await calcMultiPersonPoses(webcamRef, model);
    //     if (isPoses(newPoses) && canvasRef.current){
    //         const {videoWidth, videoHeight} = getVideoSize(
    //             webcamRef?.current?.video as HTMLVideoElement
    //         );
    //         canvasRef.current.width = videoWidth;
    //         canvasRef.current.height = videoHeight;
    //         const ctx = canvasRef.current.getContext("2d");
    //
    //         if (isContext2D(ctx)) {
    //             // ctx.fillStyle = "rgb( 0, 0, 0)";
    //             // ctx.beginPath();
    //             // ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //             newPoses.forEach((pose) => drawSinglePerson(pose, 0.2, ctx));
    //             console.log(newPoses);
    //         }
    //     }
    // }, 100);

    useInterval(async () => {
        await setPoseEstimation(webcamRef, model);
        if (isPoses(poses) && canvasRef.current){
            const {videoWidth, videoHeight} = getVideoSize(
                webcamRef?.current?.video as HTMLVideoElement
            );
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
            const ctx = canvasRef.current.getContext("2d");

            if (isContext2D(ctx)) {
                // ctx.fillStyle = "rgb( 0, 0, 0)";
                // ctx.beginPath();
                // ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                poses.forEach((pose) => drawSinglePerson(pose, 0.2, ctx));
            }
        }
    }, 100);

    return (
        <>
            <Webcam ref={webcamRef} style={WebcamStyle}/>
            {/*<button onClick={() => capture()}>ともちゃん</button>*/}

            {/*<img src={imgUrl} ref={imgRef} onLoad={onLoadEstimation}/>*/}
            <canvas ref={canvasRef} style={WebcamStyle}/>
        </>
    );
};

export default CustomWebcam;
