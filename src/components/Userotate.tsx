// src/components/Userotate.ts
import { useTime, useTransform, MotionValue } from "framer-motion";

// Define a custom hook that returns a MotionValue for rotation
export const useRotate = (): MotionValue<number> => {
  const time = useTime();
  return useTransform(time, [0, 100000], [0, 360], { clamp: false });
};
