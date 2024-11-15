"use client"
import { Dispatch, FunctionComponent, ReactElement, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import Button from "../ui/button";
import ReactConfetti from "react-confetti";
import { userIdCreationMap } from "@/app/constants/userMappings";
import { useUpdateUserPoints } from "@/app/api/apiClient";
import { PointsUpdateRequest } from "@/app/models/IPoints";
import { ApplicationContext, ApplicationContextData } from "@/app/context/ApplicationContext";

interface NewUserMetricsProps {
    isDisplayingYears: boolean;
    setIsDisplayingYears: Dispatch<SetStateAction<boolean>>
    setIsShowingNewUserInfo: Dispatch<SetStateAction<boolean>>
    userId: string | null
}

const NewUserMetrics: FunctionComponent<NewUserMetricsProps> = (
    { isDisplayingYears, setIsDisplayingYears, setIsShowingNewUserInfo, userId }): ReactElement => {

    const updateUserPoints = useUpdateUserPoints();
    const { userProfileInformation, updateUserProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;
    const [years, setYears] = useState(0);
    const [messages, setMessages] = useState(0);
    const [fetchedMetrics, setFetchedMetrics] = useState(false);
    const infoUploaded = useRef(false);

    const viewLimit = (index: number) => {
        if (index == 1) {
            return 100;
        }
        return 100;
    };

    const handleUpdateUserPoints = async (points: number, metric: 'age' | 'messages') => {
        console.log("🚀 ~ Updating for ~ metric:", metric)
        
        const data: PointsUpdateRequest = {
            points,
            userId: userProfileInformation?.userId as string,
            accountMetrics: metric
        };

        await updateUserPoints(data)
            .then((response) => {
                console.log("🚀 ~ .then ~ response:", response);
                updateUserProfileInformation(response.data);
            })
            .catch((error) => {
                console.log("🚀 ~ .catch ~ error:", error)
            })
    };

    useEffect(() => {
        if (infoUploaded.current) return;
        if (!userId || fetchedMetrics) return;

        let agePoints: number = 0;
        let messagesPoints: number = 0;

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
        };

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
        };

        agePoints = estimateAccountAge(Number(userId));
        messagesPoints = estimateMessageCount(Number(userId));

        setYears(agePoints ?? 0)
        setMessages(messagesPoints ?? 0)

        setFetchedMetrics(true);
        infoUploaded.current = true;

        // if (userProfileInformation?.agePoints || userProfileInformation?.messagesPoints || fetchedMetrics) return
        // (async () => (
        //     Promise.all([
        //         await handleUpdateUserPoints(estimateAccountAge(Number(userId)), 'age'),
        //         await handleUpdateUserPoints(estimateMessageCount(Number(userId)), 'messages')
        //     ])
        // ))()

        // Trigger handleUpdateUserPoints only if needed
        if (!userProfileInformation?.agePoints && !userProfileInformation?.messagesPoints && !fetchedMetrics) {
            const updateUserPoints = async () => {
                await handleUpdateUserPoints(agePoints, 'age')
                .then(async () => {
                    await handleUpdateUserPoints(messagesPoints / 5, 'messages')
                    .then(() => {
                        infoUploaded.current = true;
                    })
                })
                .catch(() => {
                    infoUploaded.current = false;
                })
            };
            updateUserPoints();
        }
    }, [userId, userProfileInformation, infoUploaded]);

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
                                {/* <p>Your account number is #233R3412009</p> */}
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