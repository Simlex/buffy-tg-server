"use client"
import React, { useEffect, useState } from 'react'
import { useFetchReferralLeaderboard } from '../api/apiClient'
import CustomImage from '../components/ui/image'
import images from '@/public/images'
import { ReferralConfig } from '../constants/referralConfig'

interface ReferralLeaderboard {
    userId: string
    username: string
    referralContestCount: number
}

export default function ReferralBoardPage() {

    const fetchReferralLeaderboard = useFetchReferralLeaderboard();

    const [referralLeaderboard, setReferralLeaderboard] = useState<ReferralLeaderboard[]>([]);
    const [isFetchingLeaderboard, setIsFetchingLeaderboard] = useState(true);

    const handleFetchReferralLeaderboard = async () => {
        await fetchReferralLeaderboard()
            .then((response) => {
                // console.log("🚀 ~ .then ~ response:", response)
                setReferralLeaderboard(response.data);
                setIsFetchingLeaderboard(false);
            })
            .catch(() => {
                // console.log("🚀 ~ handleFetchReferralLeaderboard ~ error:", error)
                setIsFetchingLeaderboard(false);
            })
    };

    useEffect(() => {
        handleFetchReferralLeaderboard();
    }, []);

    // check if the referral contest has started
    const referralContestStartDate = ReferralConfig.contestStartDate;

    const hasReferralContestStarted = new Date().toISOString() >= new Date(referralContestStartDate).toISOString();
    // console.log("🚀 ~ ReferralBoardPage ~ new Date(referralContestStartDate):", new Date(referralContestStartDate))
    // console.log("🚀 ~ ReferralBoardPage ~ new Date():", new Date())
    // console.log("🚀 ~ ReferralBoardPage ~ hasReferralContestStarted:", hasReferralContestStarted)

    return (
        <main className="flex min-h-screen flex-col items-center py-10 pb-24">
            <h2 className="text-white font-medium text-3xl mb-4">Referral leaderboard 🚀</h2>

            {
                !hasReferralContestStarted &&
                <div className='h-32 w-full grid place-items-center bg-white/20 rounded-lg animate-pulse'>
                    <p className='text-white text-center'>Referral contest has not started yet</p>
                </div>
            }
            {
                hasReferralContestStarted && referralLeaderboard && referralLeaderboard.length == 0 && !isFetchingLeaderboard &&
                <div className='h-32 w-full grid place-items-center bg-white/20 rounded-lg animate-pulse'>
                    <p className='text-white text-center'>No data available yet.</p>
                </div>
            }

            {
                hasReferralContestStarted && referralLeaderboard && referralLeaderboard.length > 0 && !isFetchingLeaderboard &&
                <>
                    <div className='flex flex-row py-5 items-center justify-between w-full'>

                        <div className='flex flex-col items-center w-[30%]'>
                            {/* <div className='text-white font-medium text-2xl w-16 h-16 rounded-full bg-white/50 grid place-items-center border-[10px] border-[#24A1DE]/5 mb-1 uppercase'>
                                {`${referralLeaderboard[1].username[0]}${referralLeaderboard[1].username[1]}`}
                            </div> */}
                            <span className="w-16 h-16 relative grid place-items-center rounded-full mb-1 overflow-hidden">
                                <CustomImage src={images.diamond} alt="Coin" />
                            </span>
                            {
                                referralLeaderboard[1] &&
                                <>
                                    <p className='text-sm text-white'>@{referralLeaderboard[1].username}</p>
                                    <p className='text-xs text-white font-semibold'>{referralLeaderboard[1].referralContestCount}</p>
                                </>
                            }
                        </div>
                        <div className='flex flex-col items-center w-[30%]'>
                            {/* <div className='text-white font-medium text-3xl w-20 h-20 rounded-full bg-white/50 grid place-items-center border-[10px] border-[#24A1DE]/5 mb-1 uppercase'>
                                {`${referralLeaderboard[0].username[0]}${referralLeaderboard[0].username[1]}`}
                            </div> */}
                            <span className="w-20 h-20 relative grid place-items-center rounded-full mb-1 overflow-hidden">
                                <CustomImage src={images.emerald} alt="Coin" />
                            </span>
                            {
                                referralLeaderboard[0] &&
                                <>
                                    <p className='text-sm text-white'>@{referralLeaderboard[0].username}</p>
                                    <p className='text-xs text-white font-semibold'>{referralLeaderboard[0].referralContestCount}</p>
                                </>
                            }
                        </div>
                        <div className='flex flex-col items-center w-[30%]'>
                            {/* <div className='text-white font-medium text-2xl w-16 h-16 rounded-full bg-white/50 grid place-items-center border-[10px] border-[#24A1DE]/5 mb-1 uppercase'>
                                {`${referralLeaderboard[2].username[0]}${referralLeaderboard[2].username[1]}`}
                            </div> */}
                            <span className="w-16 h-16 relative grid place-items-center rounded-full mb-1 overflow-hidden">
                                <CustomImage src={images.jewel} alt="Coin" />
                            </span>
                            {
                                referralLeaderboard[2] &&
                                <>
                                    <p className='text-sm text-white'>@{referralLeaderboard[2].username}</p>
                                    <p className='text-xs text-white font-semibold'>{referralLeaderboard[2].referralContestCount}</p>
                                </>
                            }
                        </div>
                    </div>

                    <div className='flex flex-col w-full'>
                        {
                            referralLeaderboard.map((user, index) => {
                                if (index < 3) return;

                                let rank = '';
                                let rankColor = '';

                                if (index >= 3 && index <= 10) {
                                    rank = "PL";
                                    rankColor = "bg-[#fff41d]";
                                };

                                if (index >= 11 && index <= 20) {
                                    rank = "GL";
                                    rankColor = "bg-[#C0C0C0]";
                                };

                                if (index >= 21 && index <= 50) {
                                    rank = "SL";
                                    rankColor = "bg-[#1edaff]";
                                };

                                if (index >= 51 && index <= 100) {
                                    rank = "BR";
                                    rankColor = "bg-[#ff91eb]";
                                };

                                if (index >= 101 && index <= 200) {
                                    rank = "BI";
                                    rankColor = "bg-[#CD7F32]";
                                };

                                return (
                                    <div key={index} className='flex flex-row justify-between items-center w-full py-3 px-5 bg-white/10 rounded-xl mb-2'>
                                        <span className={`w-10 h-10 ${rankColor ?? 'bg-white'} rounded-full grid place-items-center`}>{rank}</span>
                                        <p className='text-white'>@{user.username.slice(0, 13)}{user.username.length > 13 ? '...' : ''}</p>
                                        <h4 className='text-sm text-white font-semibold'>{user.referralContestCount}</h4>
                                    </div>
                                )
                            })
                        }
                    </div>
                </>
            }

            {
                hasReferralContestStarted && referralLeaderboard && referralLeaderboard.length == 0 && isFetchingLeaderboard &&
                <div className="w-16 h-16 mt-20 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin" />
            }
        </main>
    )
}