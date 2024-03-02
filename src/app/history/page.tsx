"use client";

import React from 'react';
import HistoryCard from '@/components/HistoryCard';
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { useAccount } from 'wagmi';

const GET_SPIN_RESULTS = gql`
    query GetSpinResults($player: String!) {
        spinResults(where: { player: $player }, orderBy: timestamp, orderDirection: desc) {
            winAmount
            winMultiplier
            timestamp
        }
    }
`;

const HistoryPage: React.FC = () => {
    const { address } = useAccount();
    const { loading, error, data } = useQuery(GET_SPIN_RESULTS, {
        variables: { player: address },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    console.log(data.spinResults);

    return (
        <div>
            <Link href="/" className='m-1'><span className='font-bold'>&lt;</span>back</Link>
            <HistoryCard bets={data.spinResults} />
        </div>
    );
};

export default HistoryPage;
