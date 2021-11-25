// import {CustomWebcam2} from "./components/Camera/CustomWebcam2";
import CustomAppBar from "./components/AppBar/AppBar";
import {Grid} from "@mui/material";
import CustomWebcam from "./components/Camera/CustomWebcam";

export const App = () => {
    return (
        <>
            <CustomAppBar/>
            <Grid container spacing={2}>
                <CustomWebcam/>
            </Grid>
        </>
    );
};