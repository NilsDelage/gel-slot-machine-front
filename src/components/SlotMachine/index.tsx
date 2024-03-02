import React from 'react';
import Image from 'next/image';
import Slot from '@/components/Slot';
import { useRef, useImperativeHandle, forwardRef } from 'react';

interface SlotActions {
    stopSlot: (imToStop: number) => void;
    startSlot: () => void;
}

interface SlotMachineProps {
    onRollComplete: () => void;
}


const SlotMachine = forwardRef((props:SlotMachineProps, ref) => {
    const slot1Ref = useRef<SlotActions>(null);
    const slot2Ref = useRef<SlotActions>(null);
    const slot3Ref = useRef<SlotActions>(null);

    useImperativeHandle(ref, () => ({
        startMachine() {
            startSlotMachine();
        },
        stopSlot1(imToStop: number) {
            if (slot1Ref.current) {
                slot1Ref.current.stopSlot(imToStop);
            }
        },
        stopSlot2(imToStop: number) {
            if (slot2Ref.current) {
                slot2Ref.current.stopSlot(imToStop);
            }
        },
        stopSlot3(imToStop: number) {
            if (slot3Ref.current) {
                slot3Ref.current.stopSlot(imToStop);
            }
        }
    }));


    const startSlotMachine = async () => {
        if (slot1Ref.current) {
            slot1Ref.current.startSlot();
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        if (slot3Ref.current) {
            slot3Ref.current.startSlot();
        }
        await new Promise(resolve => setTimeout(resolve, 300));
        if (slot2Ref.current) {
            slot2Ref.current.startSlot();
        }
    };

    return (
        <div className="relative mt-4 mx-4 mb-0 sm:m-10 w-[306px] sm:w-[712px] h-[157px] sm:h-[314px]">
            <div className="flex justify-between items-center absolute top-0 left-0 right-0 h-full z-10 mx-[34px] sm:mx-[95px]">
                <Slot rollDelay={0.49} ref={slot1Ref} />
                <Slot rollDelay={0.45} ref={slot2Ref} />
                <Slot rollDelay={0.54} ref={slot3Ref} onRollComplete={props.onRollComplete}/>
            </div>

            <Image
                src="/slot-machine.svg"
                alt="Slot Machine"
                layout="fill"
                objectFit="contain"
                style={{
                    filter: 'drop-shadow(0 0 7px white)',
                    imageRendering: 'crisp-edges'
                }}
            />
        </div>
    );
});

SlotMachine.displayName = 'SlotMachine';
export default SlotMachine;
