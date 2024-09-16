"use client";
import { useState, useEffect } from "react";

export const useCountdown = () => {
  const [isNewClicked, setIsNewClicked] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isNewClicked) {
      intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(intervalId);
            setIsNewClicked(false);
            return 60; 
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isNewClicked]);

  return { isNewClicked, setIsNewClicked, countdown };
};
