"use client";

import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { slotMachineContractAddress } from '@/utils/constants';
import Image from 'next/image';
import { useWaitForTransactionReceipt, useWriteContract, useAccount } from 'wagmi';
import { parseEther } from 'viem'
import abi from '@/utils/abi.json';
import { FloatingNotification } from '@/components/notifications/FloatingNotification';

interface RoundButtonProps {
  triggerStartSlotMachine: () => void;
  handleTransactionReceipt: () => void;
}

interface RoundButtonRef {
  enableButton: () => void;
}

const RoundButton = forwardRef<RoundButtonRef, RoundButtonProps>(({ triggerStartSlotMachine, handleTransactionReceipt }, ref) => {
  const { data: hash, writeContract, isError } = useWriteContract()
  const { isConnected, address, chainId } = useAccount()
  const [shouldDisableButton, setShouldDisableButton] = useState(false)
  const [showSubmittedMessage, setShowSubmittedMessage] = useState<boolean>(false);
  const [showConfirmedMessage, setShowConfirmedMessage] = useState<boolean>(false);

  const enablePlayButton = () => {
    setShouldDisableButton(false);
  }
  useImperativeHandle(ref, () => ({
    enableButton() {
      console.log('step2')
      enablePlayButton();
      console.log('step3')
    }
  }));

  const handleClick = async () => {
    if (!address) {
      console.error("address could not be found");
      // Handle the undefined address case (e.g., show an error message to the user)
      return;
    }
    setShouldDisableButton(true);

    try {
      await writeContract({
        abi,
        address: slotMachineContractAddress,
        functionName: 'play',
        value: parseEther('0.001'),
        chainId: 137,
      });
    } catch (error) {
      console.error("Error during play", error);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash, })

  useEffect(() => {
    if (isConfirmed) {
      handleTransactionReceipt();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (isError) { // Vérifie si `hash` est non null ou non undefined
      setShouldDisableButton(false)
    }
  }, [isError]);

  useEffect(() => {
    let submittedTimer: ReturnType<typeof setTimeout> | undefined;
    let confirmedTimer: ReturnType<typeof setTimeout> | undefined;

    // Show "Transaction Submitted..." notification when transaction is being confirmed
    if (isConfirming) {
      triggerStartSlotMachine();

      setShowSubmittedMessage(true);
    }

    // When the transaction is confirmed, show "Transaction Confirmed..." notification
    if (isConfirmed) {
      // Ensure to hide the "Transaction Submitted..." notification
      setShowSubmittedMessage(false);
      setShowConfirmedMessage(true);
      // Automatically hide "Transaction Confirmed..." notification after 5 seconds
      confirmedTimer = setTimeout(() => {
        setShowConfirmedMessage(false);
      }, 5000);
    }

    // Cleanup function to clear timers
    return () => {
      if (submittedTimer) clearTimeout(submittedTimer);
      if (confirmedTimer) clearTimeout(confirmedTimer);
    };
  }, [isConfirming, isConfirmed]);


  return (
    <div>
      <FloatingNotification className='bg-red-200' message="Transaction Submitted, Awaiting Confirmation..." visible={showSubmittedMessage} />
      <FloatingNotification className='bg-red-200' message="Transaction Confirmed, Awaiting VRF Response..." visible={showConfirmedMessage} />


      <button
        className="rounded-full absolute w-[45px] h-[45px] sm:w-[110px] sm:h-[110px] top-[34px] sm:top-[46px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:brightness-110 transform-brightness duration-500 ease-out disabled:brightness-50"
        aria-label="Play"
        onClick={handleClick}
        disabled={!isConnected || shouldDisableButton || chainId !== 137}
      >
        <Image
          src="/play-button.png"
          alt="Play"
          layout='fill'
          draggable={false}
        />
      </button>
    </div>
  );
});

RoundButton.displayName = 'RoundButton';
export default RoundButton;
