"use client";

import { motion, MotionProps } from "framer-motion";
import React, { ElementType, ComponentPropsWithoutRef } from "react";

type MotionComponentProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & MotionProps & ComponentPropsWithoutRef<T>; 

export const MotionComponent = <T extends ElementType = "div">({
  as,
  className = "",
  children,
  ...motionProps
}: MotionComponentProps<T>) => {
  const Tag = as || "div"; 
  const MotionTag = motion(Tag) as React.ElementType; 

  return (
    <MotionTag className={className} {...motionProps}>
      {children}
    </MotionTag>
  );
};
