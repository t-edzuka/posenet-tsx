import { useWebcamHandle } from "../../utils/hooks/useWebcamHandle";
import CustomWebcam from "./CustomWebcam";
import { HandleButton } from "../Buttons/HandleButton";
import BasicTextFields from "../TextField/BasicTextField";

export const CustomWebcam2 = () => {
  const [enablePlay, handlePlay] = useWebcamHandle();
  return (
    <>
      {enablePlay ? <CustomWebcam /> : null}
      <HandleButton enablePlay={enablePlay} onClick={handlePlay} />
      <BasicTextFields />

    </>
  );
};
