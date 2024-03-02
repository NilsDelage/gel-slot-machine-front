import React, { forwardRef, useState, useImperativeHandle, useRef, useEffect } from 'react';
import Image from 'next/image';
import RoundButton from './PlayButton';
import { slotMachineContractAddress } from '@/utils/constants';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import abi from '@/utils/abi.json';

interface ControlPannelProps {
    triggerStartSlotMachine: () => void;
    handleTransactionReceipt: () => void;
}

interface ControlPannelRef {
    enableButton: () => void;
}


const ControlPannel = forwardRef<ControlPannelRef, ControlPannelProps>(({ triggerStartSlotMachine, handleTransactionReceipt }, ref) => {
    const [ethPrice, setEthPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const playButtonRef = useRef<ControlPannelRef>(null)

    const betAmountResult = useReadContract({
        address: slotMachineContractAddress,
        abi,
        chainId: 137,
        functionName: 'betAmount',
    });

    const jackpotMultiplierResult = useReadContract({
        address: slotMachineContractAddress,
        abi,
        chainId: 137,
        functionName: 'jackpotMultiplier',
    });

    useImperativeHandle(ref, () => ({
        enableButton() {
            if (playButtonRef.current) {
                playButtonRef.current.enableButton();
            }
        }
    }));


    useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
                const data = await response.json();
                setEthPrice(data.ethereum.usd);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch ETH price');
                setLoading(false);
            }
        };

        fetchEthPrice();
    }, []);


    return (
        <div className="relative h-[80px] sm:h-[120px] w-[300px] sm:w-[720px]">
            <Image
                src="/board.svg"
                alt="Control Pannel"
                layout="fill"
                style={{ filter: 'drop-shadow(0 0 7px white)' }}
                draggable={false}
            />
            <div className="absolute left-[5%] sm:left-[10%] top-0 bottom-0 w-2/6 sm:w-1/4 bg-black px-4 py-1 rounded-2xl my-4 overflow-hidden">
                <p className="text-center text-red-400 sm:pb-2 text-sm">Bet</p>
                {(betAmountResult.isLoading) ? (
                    <p className='text-center text-gray-500'>fetching bet size...</p>
                ) : (
                    <div>
                        <p
                            className="text-center text-white text-sm sm:text-xl"
                            style={{ textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff' }}
                        >{Number(formatEther((betAmountResult.data as bigint)))} ETH
                        </p>

                        <p className="text-center text-slate-400 text-xs mt-8 sm:mt-0">{error ? (
                            "Error fetching ETH price"
                        ) : (
                            loading ? (
                                "Loading..."
                            ) : (
                                `~$${(Number(formatEther((betAmountResult.data as bigint))) * ethPrice!).toPrecision(3)}`
                            )
                        )}
                        </p>
                    </div>
                )}
            </div>

            <div className="absolute right-[5%] sm:right-[10%] top-0 bottom-0 w-2/6 sm:w-1/4 bg-black px-3 py-1 rounded-2xl my-4 overflow-hidden">
                <p className="text-center text-red-400 sm:pb-2 text-sm">Jackpot</p>
                {(betAmountResult.isLoading || jackpotMultiplierResult.isLoading) ? (
                    <p className='text-center text-gray-500'>fetching Jackpot amount...</p>
                ) : (
                    <div>
                        <p
                            className="text-center text-white text-sm sm:text-xl"
                            style={{ textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff' }}
                        >{Number(formatEther((betAmountResult.data as bigint) * (jackpotMultiplierResult.data as bigint)))} ETH
                        </p>

                        <p className="text-center text-slate-400 text-xs mt-8 sm:mt-0">{error ? (
                            "Error fetching ETH price"
                        ) : (
                            loading ? (
                                "Loading..."
                            ) : (
                                `~$${(Number(formatEther((betAmountResult.data as bigint) * (jackpotMultiplierResult.data as bigint))) * ethPrice!).toPrecision(3)}`
                            )
                        )}
                        </p>
                    </div>
                )}
            </div>
            <RoundButton ref={playButtonRef} triggerStartSlotMachine={triggerStartSlotMachine} handleTransactionReceipt={handleTransactionReceipt} />
        </div>
    );
});

ControlPannel.displayName = 'ControlPannel';
export default ControlPannel;