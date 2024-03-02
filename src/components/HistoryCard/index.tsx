import React from 'react';
import { formatEther } from 'viem';

// Define the structure of a bet
interface Bet {
    winAmount: string;
    winMultiplier: string;
    timestamp: string;
}

// Props for the component
interface BetsListProps {
    bets: Bet[];
}

// The BetsList component
const BetsList: React.FC<BetsListProps> = ({ bets }) => {
    return (
        <div className="overflow-hidden shadow-lg rounded-lg mt-2 mb-16 mx-4 xl:mx-64 border-[rgba(0,0,0,0.1)] ">
            <table className="min-w-full mx-auto text-center text-xs sm:text-base">
                <thead className="bg-gradient-to-r from-red-300 to-red-400">
                    <tr>
                        <th className="px-1 sm:px-6 py-3 border-b-2 border-black text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Result</th>
                        <th className="px-1 sm:px-6 py-3 border-b-2 border-black text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Bet</th>
                        <th className="px-1 sm:px-6 py-3 border-b-2 border-black text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Amount Won</th>
                        <th className="px-1 sm:px-6 py-3 border-b-2 border-black text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Multiplier</th>
                        <th className="px-1 sm:px-6 py-3 border-b-2 border-black text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Time</th>
                    </tr>
                </thead>
                <tbody className="bg-gradient-to-r from-red-200 to-red-300">
                    {bets.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-black">You have no bets for now</td>
                        </tr>
                    ) : (
                        bets.map((bet, index) => (
                            <tr key={index} className={`border-b last:border-b-0 border-[rgba(0,0,0,0.1)]  ${bet.winAmount !== "0" ? 'text-black font-medium' : 'text-gray-400'}`}>
                                <td className="px-6 py-4 whitespace-no-wrap">{bet.winAmount !== "0" ? 'Won' : 'Lost'}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">0.001 ETH</td>
                                <td className="px-6 py-4 whitespace-no-wrap">{formatEther(BigInt(bet.winAmount))} ETH</td>
                                <td className="px-6 py-4 whitespace-no-wrap">{bet.winMultiplier}x</td>
                                <td className="px-6 py-4 whitespace-no-wrap">{new Date(parseInt(bet.timestamp) * 1000).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BetsList;
