import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type Props = {
    enablePlay: boolean;
    onClick: () => void;
};

export const HandleButton = (props:Props) => {
    const {enablePlay, onClick} = props;
    return (
        <Button onClick={() => onClick()}>
            <Typography variant="h4" color="secondary">{enablePlay ? "一時停止" : "再開"}</Typography>
        </Button>
    );
};
