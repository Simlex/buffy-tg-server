"use client"
import { Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useState } from "react";
import Button from "../ui/button";
import ReactConfetti from "react-confetti";
import { userIdCreationMap } from "@/app/constants/userMappings";

interface NewUserMetricsProps {
    isDisplayingYears: boolean;
    setIsDisplayingYears: Dispatch<SetStateAction<boolean>>
    setIsShowingNewUserInfo: Dispatch<SetStateAction<boolean>>
    userId: string | null
}

const NewUserMetrics: FunctionComponent<NewUserMetricsProps> = (
    { isDisplayingYears, setIsDisplayingYears, setIsShowingNewUserInfo, userId }): ReactElement => {

    const [years, setYears] = useState(0);
    const [messages, setMessages] = useState(0);

    const viewLimit = (index: number) => {
        if (index == 1) {
            return 100;
        }
        return 100;
    };

    useEffect(() => {
        console.log("🚀 ~ userId:", userId)
        /**
         * A baseline map of known user IDs and their account creation dates.
         * You would populate this with accurate, known data points.
         */
        // const userIdCreationMap = [
        //     { userId: 1, creationDate: new Date('2013-08-14') },     // Launch date
        //     { userId: 150000, creationDate: new Date('2014-08-14') }, // ~1 year: 100k daily active users
        //     { userId: 550000, creationDate: new Date('2015-01-01') }, // ~1.5 years: rapid growth
        //     { userId: 1500000, creationDate: new Date('2015-06-01') }, // 2 years: crossing 1M users
        //     { userId: 55000000, creationDate: new Date('2016-12-01') }, // 3 years: 5M users
        //     { userId: 150000000, creationDate: new Date('2017-10-01') }, // 4 years: 10M users
        //     { userId: 350000000, creationDate: new Date('2018-12-01') }, // 5 years: reaching 30M users
        //     { userId: 500000000, creationDate: new Date('2019-12-01') }, // 6 years: 50M users
        //     { userId: 1500000000, creationDate: new Date('2020-12-01') }, // 7 years: 100M users
        //     { userId: 3000000000, creationDate: new Date('2021-12-01') }, // 8 years: 200M users
        //     { userId: 7500000000, creationDate: new Date('2022-12-01') }, // 9 years: 300M users
        //     { userId: 9500000000, creationDate: new Date('2023-12-01') }, // 10 years: 500M users
        //     { userId: 25000000000, creationDate: new Date('2024-12-01') }  // 11 years: projected 950M users
        // ];
        // const userIdCreationMap = [
        //     { userId: 1, creationDate: new Date('2013-08-14') },         // Launch date
        //     { userId: 100000, creationDate: new Date('2014-08-14') },    // ~1 year: early growth
        //     { userId: 500000, creationDate: new Date('2015-01-01') },    // ~1.5 years: steady rise
        //     { userId: 1500000, creationDate: new Date('2015-06-01') },   // 2 years: crossing 1.5M users
        //     { userId: 50000000, creationDate: new Date('2016-12-01') },  // 3 years: reaching 50M users
        //     { userId: 150000000, creationDate: new Date('2017-10-01') }, // 4 years: hitting 150M users
        //     { userId: 400000000, creationDate: new Date('2018-12-01') }, // 5 years: reaching 400M users
        //     { userId: 650000000, creationDate: new Date('2019-12-01') }, // 6 years: your target user ID now at 5 years age
        //     { userId: 1000000000, creationDate: new Date('2020-12-01') }, // 7 years: hitting 1B users
        //     { userId: 2500000000, creationDate: new Date('2021-12-01') }, // 8 years: significant growth
        //     { userId: 5000000000, creationDate: new Date('2022-12-01') }, // 9 years: exponential increase
        //     { userId: 7500000000, creationDate: new Date('2023-12-01') }, // 10 years: major expansion
        //     { userId: 10000000000, creationDate: new Date('2024-12-01') } // 11 years: projected user growth
        // ];

        /**
         * Function to estimate the creation date of a Telegram account given a userID.
         * @param userId - The Telegram user ID
         * @returns Estimated account age in years
         */
        function estimateAccountAge(userId: number): number {
            // Find two closest data points for interpolation
            let lowerBound = userIdCreationMap[0];
            let upperBound = userIdCreationMap[userIdCreationMap.length - 1];

            // Check if the userId is lower or higher than our data points
            if (userId < lowerBound.userId) {
                return 0; // Account age is 0 years for very old user IDs
            }
            if (userId > upperBound.userId) {
                // Estimate the age based on the latest known data point
                const latestCreationDate = upperBound.creationDate.getTime();
                const accountAgeInMs = Date.now() - latestCreationDate;
                const accountAgeInYears = accountAgeInMs / (1000 * 60 * 60 * 24 * 365.25);
                return Math.floor(accountAgeInYears);
            }

            // Perform linear interpolation as before
            for (let i = 1; i < userIdCreationMap.length; i++) {
                if (userId < userIdCreationMap[i].userId) {
                    upperBound = userIdCreationMap[i];
                    lowerBound = userIdCreationMap[i - 1];
                    break;
                }
            }

            const totalIdRange = upperBound.userId - lowerBound.userId;
            const idOffset = userId - lowerBound.userId;
            const timeRange = upperBound.creationDate.getTime() - lowerBound.creationDate.getTime();
            const estimatedCreationTime = lowerBound.creationDate.getTime() + (idOffset / totalIdRange) * timeRange;

            const accountAgeInMs = Date.now() - estimatedCreationTime;
            const accountAgeInYears = accountAgeInMs / (1000 * 60 * 60 * 24 * 365.25);

            return Math.max(0, Math.floor(accountAgeInYears)); // Ensure age is not negative
        }

        function estimateMessageCount(userId: number): number {
            // Find the two closest data points for interpolation
            let lowerBound = userIdCreationMap[0];
            let upperBound = userIdCreationMap[userIdCreationMap.length - 1];

            // Check if the userId is lower or higher than our data points
            if (userId < lowerBound.userId) {
                return 0; // No messages for very early user IDs
            }
            if (userId > upperBound.userId) {
                return upperBound.messageCount; // Use the upper bound for very high user IDs
            }

            // Perform linear interpolation
            for (let i = 1; i < userIdCreationMap.length; i++) {
                if (userId < userIdCreationMap[i].userId) {
                    upperBound = userIdCreationMap[i];
                    lowerBound = userIdCreationMap[i - 1];
                    break;
                }
            }

            const totalIdRange = upperBound.userId - lowerBound.userId;
            const idOffset = userId - lowerBound.userId;
            const totalMessageRange = upperBound.messageCount - lowerBound.messageCount;

            // Calculate the estimated message count
            const estimatedMessageCount = lowerBound.messageCount + (idOffset / totalIdRange) * totalMessageRange;

            // Return the estimated message count, limited to one decimal point
            return parseFloat(estimatedMessageCount.toFixed(1));
        }

        console.log(`🚀 ~ useEffect ~ estimateAccountAge(${userId}):`, estimateAccountAge(Number(userId) ?? 0))
        console.log(`🚀 ~ useEffect ~ estimateMessageCount(${userId}):`, estimateMessageCount(Number(userId) ?? 0))
        setYears(estimateAccountAge(Number(userId) ?? 0));
        setMessages(estimateMessageCount(Number(userId) ?? 0));
    }, [userId]);

    useEffect(() => {
        if (isDisplayingYears) {
            setTimeout(() => {
                setIsDisplayingYears(false);
            }, 15000);
        }
    }, [isDisplayingYears]);

    return (
        <>
            <ReactConfetti
                recycle={false}
                numberOfPieces={350}
                gravity={0.2}
                // style={{opacity: 0.5}}
                colors={['#FF69B4', '#33CC33', '#66CCCC', '#FFCC00']}
            />
            <main className="flex min-h-screen flex-col items-center py-20 pt-4 pb-16 select-none text-white">
                <div className="flex flex-row gap-2 w-full">
                    <div className="w-full h-fit mb-8 overflow-hidden rounded-lg">
                        <span className={`h-1 block ${isDisplayingYears ? 'bg-white/100' : 'bg-white/50'}`} style={{ width: `${viewLimit(1)}%` }}></span>
                    </div>
                    <div className="w-full h-fit mb-8 overflow-hidden rounded-lg">
                        <span className={`h-1 block ${isDisplayingYears ? 'bg-white/50' : 'bg-white/100'}`} style={{ width: `${viewLimit(2)}%` }}></span>
                    </div>
                </div>
                {
                    isDisplayingYears ?
                        <>
                            <h2 className="text-3xl font-bold mb-2">Elite Member!</h2>
                            <p className="text-xl">You joined telegram</p>

                            <div className="flex flex-col items-center my-auto">
                                <span className="text-[160px] leading-none font-black">{years}</span>
                                <p className="text-2xl font-semibold">years ago</p>
                            </div>

                            <div className="mt-auto mb-3">
                                <p>Your account number is #233R3412009</p>
                                <p>You&apos;re in the Top 15% Telegram users 🔥</p>
                            </div>
                            <Button onClick={() => setIsDisplayingYears(false)}>
                                Next
                            </Button>
                        </> :
                        <>
                            <h2 className="text-3xl font-bold mb-2">That&apos;s incredible!</h2>
                            <p className="text-base text-center">Since signing up for Telegram, you&apos;ve sent</p>

                            <div className="flex flex-col items-center my-auto">
                                <span className="text-[100px] leading-none font-black">{messages > 1000 ? (messages / 1000).toFixed(1) : messages}K</span>
                                <p className="text-2xl font-semibold">Messages</p>
                            </div>

                            <div className="mt-auto mb-3">
                            </div>
                            <Button onClick={() => setIsShowingNewUserInfo(false)}>
                                Continue
                            </Button>
                        </>
                }
            </main>
        </>
    );
}

export default NewUserMetrics;