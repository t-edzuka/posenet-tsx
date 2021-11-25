import * as cocoSsd from "@tensorflow-models/coco-ssd";
import {Tensor3D} from "@tensorflow/tfjs-core";
import {useEffect, useState} from "react";
import Webcam from "react-webcam";

export const useCocoSsd = () => {
  const [model, setModel] = useState<null | cocoSsd.ObjectDetection>(null);
  const [predHumans, setPredHumans] = useState<null | cocoSsd.DetectedObject[]>(
      null
  );

  async function loadCoco() {
    const _model = await cocoSsd.load();
    setModel((_) => _model);
  }

  async function predictCoco(
      img:
          | Tensor3D
          | ImageData
          | HTMLImageElement
          | HTMLCanvasElement
          | HTMLVideoElement
  ) {
    const predictions = model && (await model.detect(img));
    return predictions;
  }

  function getHumanDetection(predictions: cocoSsd.DetectedObject[]) {
    const predHuman = predictions.filter(
        (prediction) => prediction.class === "person"
    );
    return predHuman;
  }

  async function getSetPredHuman(
      img:
          | Tensor3D
          | ImageData
          | HTMLImageElement
          | HTMLCanvasElement
          | HTMLVideoElement
  ) {
    const predictions = await predictCoco(img);
    if (predictions) {
      const _predHumans = getHumanDetection(predictions);
      setPredHumans(_ => _predHumans);
    }
  }

  async function drawBbox(ctx: CanvasRenderingContext2D) {
    if (!predHumans) return;
    predHumans.forEach((predHuman) => {
      ctx.beginPath();
      ctx.rect(...predHuman.bbox);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'green';
      ctx.fillStyle = 'green';
      ctx.stroke();
      ctx.fillText(
          predHuman.score.toFixed(3) + ' ' + predHuman.class, predHuman.bbox[0],
          predHuman.bbox[1] > 10 ? predHuman.bbox[1] - 5 : 10);
    })
  }

  function cropAsImage(pred: cocoSsd.DetectedObject, webcam: Webcam) {
    const cvs = webcam.getCanvas();
    const ctx = cvs?.getContext("2d");
    const [x, y, width, height] = pred.bbox;
    const imgData = ctx?.getImageData(x, y, width, height);
    return imgData
  }

  function cropMultiImages(webcam: Webcam) {
    const imgDataArr = predHumans?.map((predHuman) => {
      return cropAsImage(predHuman, webcam);
    });
    return imgDataArr;
  }



  useEffect(() => {
    void loadCoco();
  }, []);

  return [getSetPredHuman, drawBbox, cropMultiImages] as const;
};