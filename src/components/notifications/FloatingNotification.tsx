"use client";
import React from "react";
import {
    motion,
    AnimatePresence,
} from "framer-motion";
import { cn } from "@/utils/cn";

export const FloatingNotification = ({
    message,
    visible,
    className,
}: {
    message: string;
    visible: boolean;
    className?: string;
}) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{
                    opacity: 1,
                    y: -100,
                }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0,
                }}
                transition={{
                    duration: 0.2,
                }}
                className={cn(
                    "flex max-w-fit text-center  fixed top-2 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-8 py-2  items-center justify-center",
                    className
                )}
            >
                <p className="text-black">{message}</p>
            </motion.div>
        </AnimatePresence>
    );
};
