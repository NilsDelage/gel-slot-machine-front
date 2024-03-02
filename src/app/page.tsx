"use client";

import Image from 'next/image'
import { slotMachineContractAddress } from '@/utils/constants';
import ControlPannel from '@/components/ControlPannel';
import SlotMachine from '@/components/SlotMachine';
import ConnectButton from '@/components/ConnectButton';
import { useAccount, usePublicClient } from 'wagmi';
import abi from '@/utils/abi.json';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Orbitron } from 'next/font/google';
import { Log, formatEther} from 'viem';
import { polygon } from 'viem/chains';
import { slotMachineImages } from '@/utils/constants';

const IMAGE_NUMBER = slotMachineImages.length;

const orbitron = Orbitron({ subsets: ['latin'] });

interface SlotMachineActions {
  startMachine: () => void;
  stopSlot1: (imToStop: number) => void;
  stopSlot2: (imToStop: number) => void;
  stopSlot3: (imToStop: number) => void;
}

interface ControlPannelActions {
  enableButton: () => void;
}

type TEventlogs = Log & {
  args: {
    player: string;
    winAmount: string;
    winMultiplier: string;
  }
}

export default function Home() {

  const slotMachineRef = useRef<SlotMachineActions>(null);
  const controlPannelRef = useRef<ControlPannelActions>(null);

  const { isConnected, chainId, address, connector } = useAccount();
  const publicClient = usePublicClient();
  const [showPopup, setShowPopup] = useState(false);
  const [winMultiplier, setWinMultiplier] = useState(0);
  const [winAmount, setWinAmount] = useState(0);
  const [imageToStop, setImageToStop] = useState(0);
  console.log('imageToStop', imageToStop);


  useEffect(() => {
    console.log('imageToStop changed to:', imageToStop);
  }, [imageToStop]);


  const gameOver = async (im2Stop: number, hasWon: boolean) => {
    const finalIm = hasWon ? im2Stop : im2Stop + 1;
    slotMachineRef.current?.stopSlot3(finalIm);
  }

  const showGameOver = () => {
    const hasWon = winMultiplier !== 0;
    setShowPopup(true);
    const audio = new Audio(hasWon ? '/win-sound.mp3' : '/lost-sound.mp3');
    audio.play().catch((e) => console.error("Failed to play audio", e));
    return () => audio.pause();
  }

  //watches for VRF result
  const watchForResult = () => {
    if (publicClient) {
      const unwatch = publicClient.watchContractEvent({
        address: slotMachineContractAddress,
        abi,
        args: {
          player: address
        },
        eventName: 'SpinResult',
        pollingInterval: 2_000,
        onLogs(logs) {
          if (showPopup) {
            setShowPopup(false);
          }
          const wM = Number((logs[0] as TEventlogs).args.winMultiplier);
          console.log('winMultiplier', wM);

          const wA = Number((logs[0] as TEventlogs).args.winAmount);
          setWinAmount(wA);
          setWinMultiplier(wM);
          const imSt = imageToStop
          console.log("making gameOver on image number ", imSt);
          gameOver( imSt, wM !== 0);
          unwatch();
        },
      });
    }
  }


  const startSlotMachine = () => {
    if (slotMachineRef.current) {
      const imSt = rand(0, IMAGE_NUMBER - 1);
      setImageToStop(imSt);
      slotMachineRef.current.startMachine();
    }
  }

  // triggered by PlayButton when a transaction is confirmed
  const handleTransactionReceipt = async () => {
    if (slotMachineRef.current) {
      const imSt = imageToStop;
      // start watching for VRF result
      watchForResult();
      await new Promise(resolve => setTimeout(resolve, 3000));
      slotMachineRef.current.stopSlot1(imSt);
      await new Promise(resolve => setTimeout(resolve, 4000));
      slotMachineRef.current.stopSlot2(imSt);

    }
  }

  const sepoliaChainId = 137;

  const rand = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num
  }

  // Function to close the pop-up
  const handleClosePopup = () => {
    setShowPopup(false);
    if (controlPannelRef.current) {
      controlPannelRef.current.enableButton();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center mt-24 sm:mt-0">

      {showPopup && (
        <Popup winMultiplier={winMultiplier} winAmount={winAmount} onClose={handleClosePopup} />
      )}

      {chainId !== sepoliaChainId && isConnected && (
        <div className="bg-red-500 text-white p-2 text-center top-0 w-full cursor-pointer" onClick={() => connector!.switchChain!({ chainId: polygon.id })}>
          Warning: You are connected to an unsupported network, click here to connect to polygon.
        </div>
      )}

      <ConnectButton />

      <Image alt="Gelato" src="/gelato_sign.png" width={500} height={500} draggable={false} />
      <h1 className={`text-4xl sm:text-6xl text-black text-center font-bold ${orbitron.className}`}
        style={{
          filter: `drop-shadow(0 0 0.4rem #fff)`,
          WebkitTextStroke: `2px white`,
        }}>Slot Machine</h1>
      <SlotMachine ref={slotMachineRef} onRollComplete={showGameOver}/>
      <ControlPannel ref={controlPannelRef} triggerStartSlotMachine={startSlotMachine} handleTransactionReceipt={handleTransactionReceipt}/>
      <p className='text-white  sm:mt-4 sm:mb-4'>
        <span className='inline-flex items-center'>
          <span className="font-roboto">Powered by</span>
          <Link href="https://vrf.app.gelato.network/" target="_blank" rel="noopener noreferrer">
          <Image src="/vrf.png" alt='Gelato VRF Logo' width={140} height={20} className='pl-2' draggable={false} />
          </Link>
        </span>
      </p>
      {/* <p className='text-white mt-0 mb-2 sm:mt-4 sm:mb-8'>
        <span className='inline-flex items-center'>
          <span className="font-roboto">Built</span>
          <Image src="/OnGelato.svg" alt='Gelato logo' width={140} height={20} className='pl-2' draggable={false} />
        </span>
      </p> */}
      {isConnected ? <Link href="/history" className='m-2 sm:mt-0 p-4 text-black bg-gradient-to-r from-red-200 to-red-300 rounded-xl'>see history</Link> : <></>}
    </main>
  )
}

interface PopupProps {
  winMultiplier: number;
  winAmount: number;
  onClose: () => void;
}


const Popup: React.FC<PopupProps> = ({ winMultiplier, winAmount, onClose }) => {

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-30">
      <div className="bg-gray-700 border-gray-300 shadow-xl rounded-lg overflow-hidden max-w-lg w-full mx-4">
        {winMultiplier === 0 ? (
          <div className='flex flex-col items-center pt-4 pb-8 px-10'>
            <p className='text-white font-semibold text-xl'>Unlucky this time</p>
          </div>
        ) : (
          <div className='flex flex-col items-center py-8 px-10'>
            <p className='text-red-300 font-semibold text-xl'>You Won!</p>
            <p className='text-white mt-2'>{(Number(formatEther(BigInt(winAmount)))).toFixed(3)} ETH has been sent to your wallet</p>
          </div>
        )}
        <button onClick={onClose} className="w-full py-3 font-semibold text-black transition-colors duration-150 ease-linear bg-gradient-to-r from-red-200 to-red-300 hover:brightness-110">
          Play Again
        </button>
      </div>
    </div>

  );
};