import ky from "ky";
import {Pose} from "@tensorflow-models/posenet";
import {format} from "date-fns";
import {isPose, isPoses} from "../validations";
import {useMountedRef} from "./useMountedRef";
import {useIntervalWhen} from "rooks";
import {useCallback, useState} from "react";
import {chooseFarmwork, choosePoseClasses} from "../gen_mock";
import {MetaData, PoseData, PredURL, sampleMetaData, URL} from "../params";

import { wholeBodyScoreThreshold} from "../params";

const poseScoreFilter = (poses:Pose[], lowerThreshold=wholeBodyScoreThreshold) => {
    return poses.filter((pose) => pose.score >= lowerThreshold)
}

const formatNow = () => format(new Date(), "yyyy-MM-dd HH:mm:ss");

export const postPoseData = async (poses: Pose[] | null,
                                   metaData: MetaData = sampleMetaData,
                                   url = URL) => {
    if (!isPose(poses) && !isPoses(poses)) {
        console.log("The data is not Pose or Pose[]");
        return;
    }

    const filteredData = poseScoreFilter(poses)
    // mock data
    const dataToPost: PoseData & MetaData = {
        poses: filteredData,
        date: formatNow(),
        farmwork: filteredData.map((_) => chooseFarmwork()),
        poseClass: filteredData.map((_) => choosePoseClasses()),
        ...metaData
    };
    // console.log(dataToPost);
    const response = await ky.post(url, {
        json: dataToPost,
        retry: {
            limit: 1,
            methods: ["post"],
            statusCodes: [503],
        },
        mode: "cors",
        timeout: 20000,
    })
        .catch((err) => console.log("err:", err));
    return response
};

export const usePostPoses = (data: Pose[] | null,
                             interval: number,
                             metaData: MetaData = sampleMetaData
) => {

    const _postPoseData = useCallback(async () => {
        await postPoseData(data, metaData, URL);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const mounted = useMountedRef();

    useIntervalWhen(async () => await _postPoseData(), interval, mounted.current);
};

export const usePredClasses = (data: Pose[] | null,
                               interval: number,
                               metaData: MetaData = sampleMetaData) => {
    const [pred, setPred] = useState<any>(null);

    const _postPoseData = useCallback(async () => {
        const res = await postPoseData(data, metaData, PredURL);
        if (!res) return;
        const payload = await res.json();
        setPred((_: any) => payload);
    }, [data, metaData]);
    const mounted = useMountedRef();
    useIntervalWhen(async () => await _postPoseData(), interval, mounted.current);

    return pred;
}