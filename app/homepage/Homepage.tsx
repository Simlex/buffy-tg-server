"use client"
import { ReactElement, FunctionComponent, useContext, useEffect } from "react"
import Image from "next/image";
import images from "@/public/images";
import Link from "next/link";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { Icons } from "../components/ui/icons";
import DailyStreakModal from "../components/modal/DailyStreakModal";
import ReactConfetti from 'react-confetti';
import { TonConnectButton } from "@tonconnect/ui-react";


const Homepage: FunctionComponent = (): ReactElement => {

    const { userProfileInformation, handleUpdateUserRollsStreak, dailyStreakUpdated, isDailyStreakModalVisible, setIsDailyStreakModalVisible } = useContext(ApplicationContext) as ApplicationContextData;

    useEffect(() => {
        if (userProfileInformation && !dailyStreakUpdated.current) {
            console.log("Updating user streak");
            handleUpdateUserRollsStreak();
        }
    }, [userProfileInformation, dailyStreakUpdated])

    return (
        <>
            <DailyStreakModal
                visibility={isDailyStreakModalVisible}
                setVisibility={setIsDailyStreakModalVisible}
            />
            <main className="flex min-h-screen flex-col items-center py-20 pb-32 select-none relative">
                <div className="flex flex-col items-center mb-10 z-10">
                    <TonConnectButton style={{ marginBottom: "32px" }} />

                    {/* <div>
                    {user.first_name && <h1 className="text-white text-3xl font-bold">{`Hello, ${user.first_name}`}</h1>}
                    {user.id && <p className="text-white/50">{`User ID: ${user.id}`}</p>}
                    {user.last_name && <p className="text-white/50">{`Last Name: ${user.last_name}`}</p>}
                    {user.username && <p className="text-white/50">{`Username: ${user.username}`}</p>}
                </div> */}
                    <span className="w-40 h-40 relative mb-5">
                        <Image src={images.coin} className="w-full h-full object-contain" alt="Buffy" />
                    </span>
                    <p className="text-sm text-white/50">Total Points</p>
                    <h1 className="text-[40px] text-white font-extrabold mb-2">{(userProfileInformation?.totalPoints ?? 0).toLocaleString()}</h1>

                    {/* <div className="flex flex-row gap-2 items-center mb-2">
                    <span className="w-7 h-7 relative grid place-items-center">
                        <CustomImage src={images.coin} alt="Coin" />
                    </span>
                    <motion.h1
                        key={userProfileInformation?.diceRollsPoints}
                        initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="text-[40px] text-white font-extrabold">
                        {(userProfileInformation?.diceRollsPoints ?? 0).toLocaleString()}
                    </motion.h1>
                </div> */}
                    <div className="flex flex-row gap-2 items-center text-white/80 mb-4">
                        <div className="flex flex-row items-center gap-2 p-2 px-3 pr-2 bg-white/10 rounded-3xl">
                            <p>{userProfileInformation?.tonEarned} TON</p>
                            <span><Icons.Ton fill="#fff" className="w-5 h-5" /></span>
                        </div>
                        <div className="flex flex-row items-center gap-2 p-2 px-3 pr-2 bg-white/10 rounded-3xl">
                            <p>{userProfileInformation?.nftEarned} NFT</p>
                            <span>
                                <Image src={images.nft_coin} alt="Nft coin" className="w-5 h-5" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full mt-auto mb-12">
                    <p className="text-white/50">Get more points</p>
                    <Link href={"/games"} className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-center font-bold py-3 px-4 shadow rounded-xl hover:from-orange-500 hover:to-orange-700 transition duration-300">Play Games</Link>
                    <Link href={"/trivia"} className="bg-white text-gray-900 text-center font-bold py-3 px-4 shadow rounded-xl hover:from-orange-500 hover:to-orange-700 transition duration-300">Daily Trivia</Link>
                </div>
            </main>
            {
                isDailyStreakModalVisible &&
                <ReactConfetti
                    recycle={false}
                    numberOfPieces={350}
                    gravity={0.2}
                    style={{ zIndex: 999 }}
                    // style={{opacity: 0.5}}
                    colors={['#FF69B4', '#33CC33', '#66CCCC', '#FFCC00']}
                />
            }
        </>
    );
}

export default Homepage;