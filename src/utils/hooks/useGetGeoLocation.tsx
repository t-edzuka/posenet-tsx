import {useCallback, useEffect, useRef, useState} from 'react';

const initialGeoPosition: Partial<GeolocationCoordinates> = {latitude: 34.7, longitude: 137.8};
export const useGetGeoLocation = () => {
    const [isAvailable, setAvailable] = useState(false);
    const [position, setPosition] = useState(initialGeoPosition);

    // useEffectが実行されているかどうかを判定するために用意しています
    const isMounted = useRef(false);

    /*
     * ページ描画時にGeolocation APIが使えるかどうかをチェックしています
     * もし使えなければその旨のエラーメッセージを表示させます
     */
    useEffect(() => {
        isMounted.current = true;
        if ('geolocation' in navigator) {
            setAvailable(true);
        }
        return () => {
            isMounted.current = false;
        }
    }, [isAvailable]);

    const getSetCurrentPosition = useCallback(() => {
            isAvailable && navigator.geolocation.getCurrentPosition((position) => {
                const {latitude, longitude} = position.coords;
                setPosition((_) => {
                    return {latitude, longitude}
                    }
                );
            }, () => setPosition((_) => initialGeoPosition))
        },
        [isAvailable]);

    return [position, isMounted, getSetCurrentPosition] as const;
}