"use client"
import { FunctionComponent, ReactElement, ReactNode, useState, useEffect, useContext, useCallback, useMemo, Suspense } from "react";
import CustomImage from "./ui/image";
import images from "@/public/images";
import { motion } from "framer-motion";
import Topbar from "./Topbar";
import BottomBar from "./BottomBar";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { splashScreenVariant } from "../animations/splashScreen";
import { useCreateReferral, useFetchUserBoostRefillEndTime, useUpdateBoostRefillEndTime, useUpdateUserPoints } from "../api/apiClient";
import { ReferralCreationRequest } from "../models/IReferral";
import { debounce } from "lodash"
import { Toaster } from "sonner";
import Script from "next/script";
import NewUserMetrics from "./IntroScreens/NewUserMetrics";
import { PointsUpdateRequest } from "../models/IPoints";
import { Game } from "../enums/Game";

interface LayoutProps {
    children?: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }): ReactElement => {

    // const createUser = useCreateUser();
    const createReferral = useCreateReferral();
    const fetchUserBoostRefillEndTime = useFetchUserBoostRefillEndTime();
    const updateBoostRefillEndTime = useUpdateBoostRefillEndTime();
    const updateUserPoints = useUpdateUserPoints();

    const {
        userProfileInformation, fetchUserProfileInformation, updateUserProfileInformation,
        updateNextUpdateTimestamp, timesClickedPerSession, taps, didInitialLoad, updateSelectedGame,
        nextUpdateTimestamp, updateTimeLeft: setTimeLeft, updateTimesClickedPerSession,
    } = useContext(ApplicationContext) as ApplicationContextData;

    const router = useRouter();
    const pathname = usePathname();
    const [loaderIsVisible, setLoaderIsVisible] = useState(true);
    const [isReferralCreated, setIsReferralCreated] = useState(false);
    const [isBoostTimeRetrieved, setIsBoostTimeRetrieved] = useState(false);

    // let isCreatingUser = false;

    const iswindow = typeof window !== 'undefined' ? true : false;

    const params = useSearchParams();
    const userId = params.get('id');
    const userName = params.get('userName');
    const referralId = params.get('referralId');

    // async function handleCreateUser(userInfo: UserProfileInformation) {
    //     if (isCreatingUser) return;

    //     isCreatingUser = true;

    //     await createUser(userInfo)
    //         .then(() => {
    //             fetchUserProfileInformation();
    //             // console.log(response);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // };

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
            // Don't show 
            if (userProfileInformation.agePoints && userProfileInformation.messagesPoints) {
                setIsShowingNewUserInfo(false);
            }
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

    // hook to create user profile
    // useMemo(() => {
    //     if (!iswindow) return;

    //     if (userId) {

    //         fetchUserProfileInformation(userId);

    //         // construct user information
    //         // const userInfo: UserProfileInformation = {
    //         //     id: userId,
    //         //     userId: userId,
    //         //     dailyFreeBoosters: 4,
    //         //     telegramTaskDone: false,
    //         //     twitterTaskDone: false,
    //         //     isWalletConnected: false,
    //         //     hadMadeFirstTonTransaction: false,
    //         //     level: 1,
    //         //     tapPoints: 0,
    //         //     diceRollsPoints: 0,
    //         //     totalPoints: 0,
    //         //     triviaPoints: 0,
    //         //     username: userName == 'None' || !userName ? generate8RandomCharacters() : userName
    //         // };

    //         // handleCreateUser(userInfo);

    //         // save to session storage
    //         // sessionStorage.setItem(StorageKeys.UserInformation, JSON.stringify(userInfo));

    //         router.refresh();
    //     }

    //     // const userProfileInformation = sessionStorage.getItem(StorageKeys.UserInformation);

    //     // if (userProfileInformation) {
    //     //     fetchUserProfileInformation(userId);
    //     // }
    // }, [userId, userName, iswindow]);

    useEffect(() => {
        // if (!iswindow) return;
        console.log("🚀 ~ useEffect ~ iswindow:", iswindow)

        if (userId) {
            console.log("🚀 ~ useEffect ~ userId:", userId);

            // (async () => {
            //     console.log("Fetching user profile information");
            //     await fetchUserProfileInformation(userId);
            // })();
            // router.refresh();
            
            fetchUserProfileInformation(userId)
        }
    }, [userId])

    // hook to create referral if referralId & user info is available, and referral is not created yet
    useMemo(() => {
        if (referralId && userProfileInformation && !isReferralCreated) {
            handleCreateReferral(userProfileInformation.userId, referralId);
        }
    }, [referralId, userProfileInformation]);

    const handleUpdateBoostRefillEndTime = useCallback(
        debounce(async (userId: string, endTime: Date) => {
            console.log("DB ACTION TRIGGERED!");
            await updateBoostRefillEndTime({ userId, refillEndTime: endTime })
                .then((response) => {
                    console.log("Boost refill time updated", response);
                })
                .catch((error) => {
                    console.error("Error updating boost refill time", error);
                });
        }, 1000), []
    );

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

    async function handleUpdateUserPoints() {

        // construct the data 
        const data: PointsUpdateRequest = {
            userId: userProfileInformation?.userId as string,
            points: taps,
            game: Game.Tap
        };

        await updateUserPoints(data)
            .then((response) => {
                console.log("🚀 ~ updateUserPoints ~ response:", response);
                // fetchUserProfileInformation();
                updateUserProfileInformation(response?.data);

                // set initial load to true
                didInitialLoad.current = false;
            })
            .catch((error) => {
                console.error(error);
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
    // function isTelegramWebView() {
    //     return navigator.userAgent.includes("Telegram");
    // }

    useEffect(() => {
        // Check if Telegram WebApp is available
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            // tg.BiometricManager.init();

            // if the app is not running in the Telegram WebApp, and not in development mode
            // if (!isTelegramWebView() && BaseUrl !== ApiRoutes.BASE_URL_DEV) {
            //     // redirect to the Telegram WebApp
            //     window.location.href = "https://t.me/your_bot_name";
            // };

            // Initialize or customize WebApp UI
            tg.setBackgroundColor('#000000');
            tg.setHeaderColor('#000000');
            tg.MainButton.text = "Click Me!";
            tg.MainButton.hide();

            // Example: Access user info
            const user = tg.initDataUnsafe.user;
            console.log("🚀 ~ telegram webapp user:", user)

            // Add a click event to the main button
            tg.MainButton.onClick(() => {
                console.log("Main button clicked");
                tg.close(); // Close the mini app
            });
        }
    }, []); // Runs once after component mounts

    const DEBOUNCE_DELAY_FOR_TAP = 1000; // Adjust the delay as needed

    useEffect(() => {
        // Skip update if taps is zero
        if (taps == 0) return;

        // Skip if this is the initial load
        if (!didInitialLoad.current) return;

        const timer = setTimeout(() => {
            handleUpdateUserPoints();
        }, DEBOUNCE_DELAY_FOR_TAP);

        return () => {
            clearTimeout(timer);
        };
    }, [taps]);

    useEffect(() => {
        if (pathname !== '/games') {
            updateSelectedGame(undefined);
        }
    }, [pathname]);

    return (
        <>
            <div>
                <Toaster
                    position='bottom-center'
                    richColors
                    closeButton
                    toastOptions={{
                        duration: 3000,
                        unstyled: false,
                    }}
                />
                {!loaderIsVisible && (
                    isShowingNewUserInfo ?
                        <NewUserMetrics
                            isDisplayingYears={isDisplayingYears}
                            setIsDisplayingYears={setIsDisplayingYears}
                            setIsShowingNewUserInfo={setIsShowingNewUserInfo}
                            userId={userId}
                        /> :
                        <main className="">
                            <Topbar />
                            {children}
                            <BottomBar />
                        </main>
                )}

                {loaderIsVisible &&
                    <motion.div
                        variants={splashScreenVariant}
                        className='w-[100vw] h-[100vh] fixed top-0 left-0 z-30 min-h-[100vh] grid place-items-center bg-white pointer-events-none'>
                        <div className='w-60 h-60 animate-pulse transition-all duration-150 ease-in-out object-contain relative'>
                            <CustomImage src={images.splash} alt='logo' />
                        </div>
                    </motion.div>}
            </div>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive" />
        </>
    );
}

export default Layout;

// export const WrappedLayout = ({ children }: LayoutProps) => {
//     return (
//         <Suspense fallback={
//             <div
//                 className='w-[100vw] h-[100vh] fixed top-0 left-0 z-30 min-h-[100vh] grid place-items-center bg-white pointer-events-none'>
//                 <div className='w-60 h-60 animate-pulse transition-all duration-150 ease-in-out object-contain relative'>
//                     <CustomImage src={images.splash} alt='logo' />
//                 </div>
//             </div>
//         }>
//             <Layout>
//                 {children}
//             </Layout>
//         </Suspense>
//     );
// };