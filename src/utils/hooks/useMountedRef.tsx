import {useEffect, useRef} from "react";

// Unmount したときに特定の処理が実行されないようにするためのbooleanのreferenceを返す.
export const useMountedRef = () => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    }
  }, []);
  return mounted;
};