import React, {useEffect} from "react";
import Webcam from "react-webcam";
// import {VideoSize, WebcamStyle} from "../../utils/params";

export const useWebcamSelect = () => {
    const [deviceId, setDeviceId] = React.useState({});
    const [devices, setDevices] = React.useState([]);

    const handleDevices = React.useCallback(
        (mediaDevices) =>
            setDevices(mediaDevices.filter(({kind}) => kind === "videoinput")),
        [setDevices]
    );

    React.useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }, [handleDevices]);

    return [deviceId, setDeviceId, devices];
};

const WebcamWithSelect = (idNum, style, videoSize) => {
    const [deviceId, setDeviceId, devices] = useWebcamSelect();
    const [width, height] = videoSize

    useEffect(() => {
        setDeviceId(_ => devices[idNum].deviceId)
    }, [idNum, setDeviceId])

    return (
        <>
            <Webcam  audio={false} style={style} videoConstraints={{deviceId, width, height}}/>
            {/*<div>*/}
            {/*    {devices.map((device, key) => (*/}
            {/*        <button*/}
            {/*            key={device.deviceId}*/}
            {/*            onClick={() => setDeviceId(device.deviceId)}*/}
            {/*        >*/}
            {/*            {device.label || `Device ${key + 1}`}*/}
            {/*        </button>*/}
            {/*    ))}*/}
            {/*</div>*/}
        </>
    );
};

export default WebcamWithSelect;
