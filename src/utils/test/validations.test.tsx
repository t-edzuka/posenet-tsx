import {
  isWebcamRef,
  isWebcam,
  isHTMLVideo,
} from "../validations";

import { renderHook, act } from "@testing-library/react-hooks";
import { useRef } from "react";
import Webcam from "react-webcam";
import { render } from "@testing-library/react";

import React from "react";
import  { unmountComponentAtNode } from "react-dom";


let container: Element | DocumentFragment | null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  // @ts-ignore
  unmountComponentAtNode(container);
  // @ts-ignore
  container.remove();
  container = null;
});

it("WebcamRef is toBeTruthy after render", () => {
  Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
    set: () => {},
  });
  const resultRef = renderHook(() => useRef(null)).result.current;
  expect(isWebcam(resultRef.current) && isWebcamRef(resultRef)).toBeFalsy();
  act(()=> {
    render(<Webcam ref={resultRef} muted/>);
  });
  expect(isWebcam(resultRef.current) && isWebcamRef(resultRef)).toBeTruthy();
});


it("Video is toBeTruthy after render", () => {
  const videoEl = document.createElement('video');
  expect(isHTMLVideo(videoEl)).toBeTruthy();
});
