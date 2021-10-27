import { useWebcamHandle } from "../../utils/hooks/useWebcamHandle";
import CustomWebcam from "./CustomWebcam";
import { HandleButton } from "../Buttons/HandleButton";

export const CustomWebcam2 = () => {
  const [enablePlay, handlePlay] = useWebcamHandle();
  return (
    <>
      {enablePlay ? <CustomWebcam /> : null}
      <HandleButton enablePlay={enablePlay} onClick={handlePlay} />
    </>
  );
};
