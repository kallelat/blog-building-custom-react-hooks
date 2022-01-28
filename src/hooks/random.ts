import { useEffect, useState } from "react";

// generates a random number between 1000 and 9000
const rand = () => Math.floor(Math.random() * 9000 + 1000);

export const useRandom = () => {
  const [number, storeNumber] = useState(rand());

  useEffect(() => {
    // create an interval, that will randomise a new number every 10sec
    const interval = setInterval(() => storeNumber(rand()), 10000);
    return () => clearInterval(interval);
  }, []);

  // return current random number
  return number;
};
