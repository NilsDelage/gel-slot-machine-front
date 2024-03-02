"use client";
import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

const ConnectButton: React.FC = () => {
    const { address, isConnected, chainId } = useAccount()
    const { connect, connectors, isPending, isSuccess } = useConnect()
    const { disconnect } = useDisconnect()
    const [displayConnectors, setDisplayConnectors] = useState(false)


    const handleClick = () => {
        // TODO : check if network is right
        if (isConnected) {
            setDisplayConnectors(false)
            disconnect()
        } else {
            setDisplayConnectors(true)
        }
    }

    // Function to truncate the address to a max of 7 characters
    const truncateAddress = (address: `0x${string}` | undefined) => {
        if (address && address.length > 7) {
            return address.substring(0, 7) + '...';
        }
        return address;
    };

    const closeModal = () => {
        setDisplayConnectors(false);
    };

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div>
            <button onClick={handleClick} className="absolute top-0 right-0 m-8 bg-white hover:opacity-80 text-black font-bold py-2 px-4 rounded-full">
                {isConnected ? truncateAddress(address) : "Connect"}
            </button>

            {displayConnectors && !isSuccess && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-30" onClick={closeModal}>
                    <div className="flex flex-col items-center p-8 justify-center bg-gray-700 border-gray-300 shadow-xl rounded-lg overflow-hidden max-w-lg w-full mx-4" onClick={stopPropagation}>
                        <div className='flex flex-col items-center pt-4 pb-8 px-10'>
                            <p className='text-white font-semibold text-xl'>Select a wallet</p>
                        </div>

                        {connectors.map((connector) => (
                            <button
                                className="mx-auto my-2 px-6 py-3 disabled:bg-gray-400 bg-red-200 text-gray-800 font-semibold rounded-lg shadow transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:-translate-y-0 disabled:hover:shadow-none"
                                disabled={!connector || isPending}
                                key={connector.id}
                                onClick={() => connect({ connector })}
                                style={{
                                    minWidth: '80%',
                                    opacity: connector ? '1' : '0.5',
                                }}
                            >
                                {connector.name}
                            </button>
                        ))}
                    </div>
                </div>
            )
            }
        </div>

    );
}

export default ConnectButton;