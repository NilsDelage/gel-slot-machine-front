"use client";

import { motion } from 'framer-motion';
import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import Image from 'next/image';
import { slotMachineImagesPng } from '@/utils/constants';
const slotMachineImages = slotMachineImagesPng
const IMAGE_NUMBER = slotMachineImages.length;

// Define a type for the props including `rollDelay`
interface SlotProps {
  rollDelay: number;
  onRollComplete?: () => void;
}

const Slot = forwardRef((props: SlotProps, ref) => {
  //screen width

  // Set default values for SSR
  const [distances, setDistances] = useState({
    DISTMAX: 280, // Default DISTMAX
    DISTMID: 150, // Default DISTMID
    DISTMIN: 15,   // Default DISTMIN
  });

  useEffect(() => {
    // Function to update distances based on window width
    const updateDistances = () => {
      const DISTMAX = globalThis?.window?.innerWidth <= 640 ? 220 : 280;
      const DISTMID = globalThis?.window?.innerWidth <= 640 ? 130 : 150;
      const DISTMIN = globalThis?.window?.innerWidth <= 640 ? 55 : 15;
      setDistances({ DISTMAX, DISTMID, DISTMIN });
    };

    // Set initial distances based on current window width
    updateDistances();

    // Optionally, adjust on window resize if dynamic adjustments are needed
    window.addEventListener('resize', updateDistances);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', updateDistances);
  }, []); // Empty dependency array ensures this runs once on mount


  const [playAnimation, setPlayAnimation] = useState(false);
  const [isToggled, setToggled] = useState(Array(IMAGE_NUMBER).fill(true));
  const [initImage, setInitImage] = useState(0);
  const [movingIm, setMovingIm] = useState(initImage);
  const [stopNow, setStopNow] = useState(false);
  const [stopAsked, setStopAsked] = useState(false);
  const [imageToStop, setImageToStop] = useState(0);

  useImperativeHandle(ref, () => ({
    startSlot() {
      startAnimation();
    },
    stopSlot(imToStop: number) {
      stopAnimation(imToStop % IMAGE_NUMBER);
    }
  }));

  const startAnimation = () => {
    setInitImage(movingIm);
    setStopNow(false);
    setStopAsked(false);

    const newToggled = [...isToggled];
    newToggled[movingIm] = false;
    setToggled(newToggled);

    setPlayAnimation(true);
  }

  const stopAnimation = (im2Stop: number) => {
    setImageToStop(im2Stop);
    setStopAsked(true);
  }

  return (
    <div className="relative flex justify-center slot-container overflow-hidden bg-neutral-800 w-[60px] h-[80px] sm:w-[120px] sm:h-[160px] rounded-xl">
      {
        slotMachineImages.map((image, index) => (
          <motion.div
            key={index}
            initial={index === initImage ? { y: distances.DISTMID } : { y: distances.DISTMIN }}
            animate={isToggled[index] ? ((index === initImage) ? { y: distances.DISTMID } : { y: distances.DISTMIN }) : ((index == imageToStop && stopNow) ? { y: distances.DISTMID } : { y: distances.DISTMAX })}
            transition={{ duration: isToggled[index] ? 0 : props.rollDelay, ease: "linear" }}
            onAnimationComplete={() => {
              if (playAnimation) {

                if (stopNow) { 
                  setPlayAnimation(false); 
                  //if props.onRollComplete is provided, call it after 0.6 seconds
                  if (props.onRollComplete) {
                    setTimeout(() => {
                      props.onRollComplete!();
                    }, 1100);
                  }
                }

                if ((index + 1) % IMAGE_NUMBER === imageToStop && stopAsked) {
                  setStopNow(true);
                }

                setMovingIm((index + 1) % IMAGE_NUMBER);
                const newToggled = [...isToggled];
                newToggled[movingIm] = !newToggled[movingIm];
                setToggled(newToggled);

                if (initImage >= 0) {
                  setInitImage(-1);

                }

              }
            }}
            className="absolute -top-[120px]"
          >
            <Image src={image} alt="slot-image" width={100} height={100} draggable={false}></Image>
          </motion.div>
        ))
      }    </div>
  );
});

Slot.displayName = 'Slot';
export default Slot;
