"use client"
import { ReactElement, FunctionComponent, useState, useContext } from "react"
import images from "@/public/images";
import { motion } from "framer-motion"
import CustomImage from "../components/ui/image";
import { Icons } from "../components/ui/icons";
import { metrics } from "../constants/userMetrics";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { Metrics } from "../enums/IMetrics";
import { sessionLimit } from "../constants/user";
import { Styles } from "../styles/styles";
import { Game } from "../enums/Game";
import Link from "next/link";

const Tappage: FunctionComponent = (): ReactElement => {

    const {
        userProfileInformation,
        timesClickedPerSession, updateTimesClickedPerSession,
        updateSelectedGame, taps, didInitialLoad, setNewClicks,
    } = useContext(ApplicationContext) as ApplicationContextData;
    function swapColorBasedOnStatus() {
        if (metrics(taps)?.status === Metrics.NOOB) {
            return "text-green-500/60";
        } else if (metrics(taps)?.status === Metrics.BEGINNER) {
            return "text-yellow-400/60";
        } else if (metrics(taps)?.status === Metrics.INTERMEDIATE) {
            return "text-red-200/60";
        } else if (metrics(taps)?.status === Metrics.PRO) {
            return "text-blue-300/60";
        } else if (metrics(taps)?.status === Metrics.MASTER) {
            return "text-purple-300/60";
        } else if (metrics(taps)?.status === Metrics.LEGEND) {
            return "text-white/60";
        }
    };

    const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleAnimationEnd = (id: number) => {
        setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
    };

    const timesClickedPerSessionThreshold = 100000;

    // async function _handleUpdateBoostRefillEndTime(endTime: Date) {
    //     await updateBoostRefillEndTime({ username: userProfileInformation?.username as string, refillEndTime: endTime })
    //         .then((response) => {
    //             console.log("Boost refill time updated", response);
    //         })
    //         .catch((error) => {
    //             console.error("Error updating boost refill time", error);
    //         });
    // };

    return (
        <main className="flex min-h-screen flex-col items-center py-20 pt-12 pb-32 select-none">
            {
                userProfileInformation &&
                <>
                    <button
                        className={`${Styles.OrangeBgLinkButton} mb-5 w-full`}
                        onClick={() => updateSelectedGame(Game.Dice)}>
                        Play Dice Roll Game
                    </button>

                    <div className="flex flex-col items-center mb-12">
                        {/* <p className="text-sm text-white/50">Points</p>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="w-7 h-7 relative grid place-items-center">
                                <CustomImage src={images.coin} alt="Coin" />
                            </span>
                            <motion.h1
                                key={userProfileInformation.tapPoints}
                                initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="text-[40px] text-white font-extrabold">
                                {(taps).toLocaleString()}{metrics(taps)?.pointSuffix}
                            </motion.h1>
                        </div> */}
                        <div className="flex flex-row gap-3 items-center">
                            <div className="flex flex-row gap-2 items-center">
                                <span className="w-6 h-6 grid place-items-center">
                                    <Icons.Trophy className="opacity-40" />
                                </span>
                                <p className={`${swapColorBasedOnStatus()} text-sm`}>{metrics(taps)?.status}</p>
                            </div>
                            <span className="h-4 w-[1px] bg-slate-50/50 block" />
                            <div className="flex flex-row gap-2 items-center">
                                <span className="w-6 h-6 grid place-items-center">
                                    <Icons.Star />
                                </span>
                                <p className="text-white/60 text-sm">Level: {userProfileInformation.level}</p>
                            </div>
                        </div>
                    </div>

                    {
                        clicks.map((click) => (
                            <div
                                key={click.id}
                                className="absolute text-4xl z-20 font-bold opacity-0 text-white pointer-events-none"
                                style={{
                                    top: `${click.y - 42}px`,
                                    left: `${click.x - 28}px`,
                                    animation: `float 1s ease-out`
                                }}
                                onAnimationEnd={() => handleAnimationEnd(click.id)}
                            >
                                +{userProfileInformation.level}
                            </div>
                        ))
                    }
                    <div className="flex relative mb-12">
                        <div className="absolute w-full h-full flex items-center justify-end z-20 pointer-events-none">
                            {/* <AnimatePresence>
                                {
                                    isClicked &&
                                    ([...Array(10)]).map((click, index) => (
                                        <motion.div
                                            key={`${Date.now()}${index}`}
                                            initial={{ opacity: 1, y: 0 }}
                                            animate={{ opacity: 0, y: -200 }}
                                            exit={{ opacity: 0, y: -200 }}
                                            transition={{ duration: 1 }}
                                            // style={{ left: click.x, top: click.y }}
                                            className="absolute z-20 text-lg text-white pr-6"
                                        >
                                            +{userProfileInformation.level}
                                        </motion.div>
                                    ))
                                }
                            </AnimatePresence> */}
                        </div>

                        <motion.span
                            onTouchStart={(e) => {
                                if (timesClickedPerSession === undefined || timesClickedPerSession >= timesClickedPerSessionThreshold) return;

                                if ((sessionLimit * userProfileInformation.level) - timesClickedPerSession <= 0) return;

                                const card = e.currentTarget;
                                const rect = card.getBoundingClientRect();
                                // Iterate through each touch point
                                Array.from(e.touches).forEach((touch) => {
                                    const x = touch.clientX - rect.left - rect.width / 2;
                                    const y = touch.clientY - rect.top - rect.height / 2;

                                    setClicks([...clicks, { id: Date.now(), x: touch.pageX, y: touch.pageY }]);

                                    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;

                                    // setTaps(taps + (1 * userProfileInformation.level));
                                    // setTaps(clicks.length + (1 * userProfileInformation.level));
                                    setNewClicks((prevClicks) => prevClicks + 1);

                                    updateTimesClickedPerSession(timesClickedPerSession + 1);
                                });

                                setTimeout(() => {
                                    card.style.transform = '';
                                }, 100);

                                // setIsClicked(!isClicked);
                            }}
                            // onClick={(e) => {
                            //     if (timesClickedPerSession === undefined || timesClickedPerSession >= timesClickedPerSessionThreshold) return;

                            //     if ((sessionLimit * userProfileInformation.level) - timesClickedPerSession <= 0) return;

                            //     const card = e.currentTarget;
                            //     const rect = card.getBoundingClientRect();

                            //     // Calculate click position relative to the element
                            //     const x = e.clientX - rect.left - rect.width / 2;
                            //     const y = e.clientY - rect.top - rect.height / 2;

                            //     // Add click to the state
                            //     setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);

                            //     // Apply perspective rotation based on click position
                            //     card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;

                            //     // Update the number of taps
                            //     // setTaps((prevTaps) => prevTaps + (1 * userProfileInformation.level));
                            //     setNewClicks((prevClicks) => prevClicks + 1);

                            //     // Increment times clicked for the session
                            //     updateTimesClickedPerSession(timesClickedPerSession + 1);

                            //     // Reset the transform after 100ms
                            //     setTimeout(() => {
                            //         card.style.transform = '';
                            //     }, 100);

                            //     setTimeout(() => {
                            //         didInitialLoad.current = true;
                            //     }, 800);
                            // }}

                            onTouchEnd={() => {
                                // run the function to update the user points after a delay of 1 second
                                setTimeout(() => {
                                    didInitialLoad.current = true;
                                }, 800);
                            }}
                            whileTap={{
                                // scale: 1.1,
                                filter: "brightness(1.25)",
                                transition: { duration: 0.1 }
                            }}
                            className="w-60 h-60 relative">
                            <CustomImage priority src={images.clicker} alt="Durov" />
                        </motion.span>
                    </div>

                    {
                        timesClickedPerSession !== undefined &&
                        <div className="flex flex-row items-center text-white mb-5">
                            <p className="text-slate-400">Energy level:</p>&nbsp;
                            <span className="text-base">{(sessionLimit * userProfileInformation.level) - timesClickedPerSession}/{(sessionLimit * userProfileInformation.level)}</span>
                        </div>
                    }

                    {/* {
                        userProfileInformation.referralCount ?
                            <div className="flex flex-row items-center text-white">
                                <p className="text-slate-400">Referral points:</p>&nbsp;
                                <span className="text-xl">{(userProfileInformation.referralCount * 1000).toLocaleString()}</span>
                            </div> : <></>
                    } */}
                    <div className="mt-10 w-full flex flex-col">
                        <Link href="/boost" className="flex flex-col items-center gap-0 p-4 py-3 rounded-xl w-full mb-3 !bg-white !text-gray-900">
                            Boost Points
                        </Link>
                    </div>
                </>
            }
        </main>
    );
}

export default Tappage;