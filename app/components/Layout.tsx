"use client"
import { FunctionComponent, ReactElement, ReactNode, useState, useEffect, useContext, useCallback, useMemo, Suspense } from "react";
import CustomImage from "./ui/image";
import images from "@/public/images";
import { motion } from "framer-motion";
import Topbar from "./Topbar";
import BottomBar from "./BottomBar";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { useRouter, useSearchParams } from "next/navigation";
import { UserProfileInformation } from "../models/IUser";
import { StorageKeys } from "../constants/storageKeys";
import { splashScreenVariant } from "../animations/splashScreen";
import { useCreateReferral, useCreateUser, useFetchUserBoostRefillEndTime, useUpdateBoostRefillEndTime } from "../api/apiClient";
import { ReferralCreationRequest } from "../models/IReferral";
import { debounce } from "lodash"
import Button from "./ui/button";
import Confetti from "react-confetti/dist/types/Confetti";
import ReactConfetti from "react-confetti";
import Image from "next/image";

interface LayoutProps {
    children?: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }): ReactElement => {

    const createUser = useCreateUser();
    const createReferral = useCreateReferral();
    const updateBoostRefillEndTime = useUpdateBoostRefillEndTime();
    const fetchUserBoostRefillEndTime = useFetchUserBoostRefillEndTime();

    const {
        userProfileInformation, fetchUserProfileInformation, updateUserProfileInformation,
        updateNextUpdateTimestamp, timesClickedPerSession,
        nextUpdateTimestamp, updateTimeLeft: setTimeLeft, updateTimesClickedPerSession,
    } = useContext(ApplicationContext) as ApplicationContextData;

    const router = useRouter();
    const [loaderIsVisible, setLoaderIsVisible] = useState(true);
    const [isReferralCreated, setIsReferralCreated] = useState(false);
    const [isBoostTimeRetrieved, setIsBoostTimeRetrieved] = useState(false);
    let isCreatingUser = false;

    const iswindow = typeof window !== 'undefined' ? true : false;

    const params = useSearchParams();
    const userId = params.get('id');
    const userName = params.get('userName');
    const referralId = params.get('referralId');

    async function handleCreateUser(userInfo: UserProfileInformation) {
        if (isCreatingUser) return;

        isCreatingUser = true;

        await createUser(userInfo)
            .then((response) => {
                fetchUserProfileInformation();
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    async function handleCreateReferral(userId: string, referrerId: string) {

        const data: ReferralCreationRequest = {
            userId: userId,
            referrerId
        };

        await createReferral(data)
            .then((response) => {
                console.log("Referral created", response);
                setIsReferralCreated(true);
            })
            .catch((error) => {
                console.error("Error creating referral", error);
            });
    };

    // hook to hide the loader after window is loaded and user profile information is fetched
    useEffect(() => {
        if (typeof window !== 'undefined' && userProfileInformation) {
            setLoaderIsVisible(false);
        }
    }, [iswindow, userProfileInformation]);

    // Effect to start the countdown timer for the next free daily boost update
    useEffect(() => {
        if (!nextUpdateTimestamp) return;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = nextUpdateTimestamp - now;

            if (distance < 0) {
                setTimeLeft('00:00:00');
                updateNextUpdateTimestamp(0);
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        };

        // Update the countdown every second
        const interval = setInterval(updateCountdown, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [nextUpdateTimestamp]);

    function generate8RandomCharacters() {
        // generate 8 random characters involving letters and numbers
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    // hook to create user profile
    useMemo(() => {
        if (!iswindow) return;

        if (userId) {

            // construct user information
            const userInfo: UserProfileInformation = {
                id: userId,
                userId: userId,
                dailyFreeBoosters: 4,
                telegramTaskDone: false,
                twitterTaskDone: false,
                level: 1,
                username: userName == 'None' || !userName ? generate8RandomCharacters() : userName
            };

            handleCreateUser(userInfo);

            // save to session storage
            sessionStorage.setItem(StorageKeys.UserInformation, JSON.stringify(userInfo));

            router.refresh();
        }

        const userProfileInformation = sessionStorage.getItem(StorageKeys.UserInformation);

        if (userProfileInformation) {
            fetchUserProfileInformation();
        }
    }, [userId, userName, iswindow]);

    // hook to create referral if referralId & user info is available, and referral is not created yet
    useMemo(() => {
        if (referralId && userProfileInformation && !isReferralCreated) {
            handleCreateReferral(userProfileInformation.userId, referralId);
        }
    }, [referralId, userProfileInformation]);

    const handleUpdateBoostRefillEndTime = useCallback(debounce(async (userId: string, endTime: Date) => {
        console.log("DB ACTION TRIGGERED!");
        await updateBoostRefillEndTime({ userId, refillEndTime: endTime })
            .then((response) => {
                console.log("Boost refill time updated", response);
            })
            .catch((error) => {
                console.error("Error updating boost refill time", error);
            });
    }, 1000), []);

    // Convert date to UTC
    function toUTCDate(date: Date): Date {
        return new Date(date.toISOString());
    };

    async function handleFetchUserBoostRefillEndTime(userId: string) {
        await fetchUserBoostRefillEndTime(userId)
            .then((response) => {
                setIsBoostTimeRetrieved(true);
                updateUserProfileInformation(response?.data.data);

                console.log("response?.data.data.boostRefillEndTime ", response?.data.data.boostRefillEndTime);

                // const currentTime = toUTCDate(new Date(Date.now()));
                const currentTime = new Date(Date.now() + 60 * 60 * 1000);
                const boostRefillEndTime = toUTCDate(new Date(new Date(response?.data.data.boostRefillEndTime).getTime() - 0));

                if (boostRefillEndTime < currentTime) {
                    updateTimesClickedPerSession(0);
                    return;
                };

                const timeDifference = boostRefillEndTime.getTime() - currentTime.getTime();
                const remainingTicks = Math.max(Math.floor(timeDifference / DEBOUNCE_DELAY_FOR_SESSION), 0);
                updateTimesClickedPerSession(remainingTicks);

                console.log("Boost refill time fetched", response);
            })
            .catch((error) => {
                console.error("Error fetching boost refill time", error);
            });
    };

    // const DEBOUNCE_DELAY_FOR_SESSION = 32400; // Delay for 3 clicks for 3hrs
    const DEBOUNCE_DELAY_FOR_SESSION = 10800; // Delay for 1 click for 3hrs

    // hook to fetch the user's boost refill end time
    useEffect(() => {
        if (userProfileInformation && !isBoostTimeRetrieved) {
            handleFetchUserBoostRefillEndTime(userProfileInformation.userId);
        }
    }, [userProfileInformation, isBoostTimeRetrieved]);

    // Use a hook to update the timesClickedPerSession back to zero after the user has stopped clicking. Decrement the timesclickedpersession by 3 till the limit is reached
    useEffect(() => {
        if (!isBoostTimeRetrieved || timesClickedPerSession === undefined) return;

        if (timesClickedPerSession === 0) return;

        let endTime: Date | null = null;

        const remainingTicks = timesClickedPerSession;
        endTime = toUTCDate(new Date(Date.now() + remainingTicks * DEBOUNCE_DELAY_FOR_SESSION));

        // if (userProfileInformation?.boostRefillEndTime && toUTCDate(new Date(userProfileInformation.boostRefillEndTime)) > currentTime) {
        //     console.log("🚀 ~ useEffect ~ boostRefillEndTime:", userProfileInformation.boostRefillEndTime)
        //     endTime = toUTCDate(new Date(new Date(userProfileInformation.boostRefillEndTime).getTime() - 60 * 60 * 1000));
        //     console.log("🚀 ~ useEffect ~ endTime 1:", endTime)
        // } else {
        //     const remainingTicks = timesClickedPerSession;
        //     endTime = toUTCDate(new Date(Date.now() + remainingTicks * DEBOUNCE_DELAY_FOR_SESSION));
        //     console.log("🚀 ~ useEffect ~ endTime 2:", endTime)
        // }

        let timer: NodeJS.Timeout;

        handleUpdateBoostRefillEndTime(userProfileInformation?.userId as string, endTime as Date);

        if (timesClickedPerSession > 0) {
            timer = setTimeout(async () => {
                updateTimesClickedPerSession(Math.max(timesClickedPerSession - 1, 0));

                // await handleUpdateBoostRefillEndTime(endTime as Date);
            }, DEBOUNCE_DELAY_FOR_SESSION);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [timesClickedPerSession, isBoostTimeRetrieved]);

    const [isShowingNewUserInfo, setIsShowingNewUserInfo] = useState(true);
    const [isDisplayingYears, setIsDisplayingYears] = useState(true);

    const viewLimit = (index: number) => {
        if (index == 1) {
            return 100;
        }
        return 100;
    };

    useEffect(() => {
        if (isDisplayingYears) {
            setTimeout(() => {
                setIsDisplayingYears(false);
            }, 15000);
        }
    }, [isDisplayingYears]);

    // useEffect(() => {
    //     if (isShowingNewUserInfo) {
    //         if (isDisplayingYears) {
    //             setTimeout(() => {
    //                 setIsDisplayingYears(false);
    //                 setTimeout(() => {
    //                     setIsShowingNewUserInfo(false);
    //                 }, 15000);
    //             }, 15000);
    //         };
    //     }
    // }, [isShowingNewUserInfo]);

    return (
        <motion.div
            initial="opened"
            animate={loaderIsVisible ? "opened" : "closed"}
        >
            {!loaderIsVisible && (
                isShowingNewUserInfo ?
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
                                            <span className="text-[160px] leading-none font-black">5</span>
                                            <p className="text-2xl font-semibold">years ago</p>
                                        </div>

                                        <div className="mt-auto mb-3">
                                            <p>Your account number is #233R3412009</p>
                                            <p>You're in the Top 15% Telegram users 🔥</p>
                                        </div>
                                        <Button onClick={() => setIsDisplayingYears(false)}>
                                            Next
                                        </Button>
                                    </> :
                                    <>
                                        <h2 className="text-3xl font-bold mb-2">That's incredible!</h2>
                                        <p className="text-base text-center">Since signing up for Telegram, you've sent</p>

                                        <div className="flex flex-col items-center my-auto">
                                            <span className="text-[100px] leading-none font-black">24.0K</span>
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
                    </> :
                    <main className="">
                        <Topbar />
                        {children}
                        <BottomBar />
                    </main>
            )}

            <motion.div
                variants={splashScreenVariant}
                className='w-[100vw] h-[100vh] fixed top-0 left-0 z-30 min-h-[100vh] grid place-items-center bg-white pointer-events-none'>
                <div className='w-60 h-60 animate-pulse transition-all duration-150 ease-in-out object-contain relative'>
                    <CustomImage src={images.splash} alt='logo' />
                </div>
            </motion.div>
        </motion.div>
    );
}

export default Layout;

export const WrappedLayout = ({ children }: LayoutProps) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Layout>
                {children}
            </Layout>
        </Suspense>
    );
};