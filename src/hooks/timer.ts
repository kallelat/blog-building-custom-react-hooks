import { useCallback, useEffect, useState } from "react";

export const useTimer = (randomNumber: number) => {
  const [seconds, storeSeconds] = useState(10);

  // a function to reduce seconds from counter, uses useCallback to improve performance
  const tick = useCallback(function () {
    storeSeconds((s) => s - 1);
  }, []);

  useEffect(() => {
    // useEffect is called when the values in the dependencies array change (either randomNumber or tick)
    // therefor we want to reset the counter here
    storeSeconds(10);

    // create an interval to count seconds
    const interval = setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [randomNumber, tick]);

  // return seconds to next random number
  return seconds;
};
