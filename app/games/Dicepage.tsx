"use client"
import { ReactElement, FunctionComponent, useState, useEffect, useRef, useContext } from "react"
import Button from "../components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Styles } from "../styles/styles";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { Game } from "../enums/Game";
import { pointsMappings } from "../constants/pointMappings";
import { useUpdateUserPoints } from "../api/apiClient";
import { PointsUpdateRequest } from "../models/IPoints";
import CustomImage from "../components/ui/image";
import images from "@/public/images";
import { Icons } from "../components/ui/icons";
import Link from "next/link";


const Dicepage: FunctionComponent = (): ReactElement => {

    const updateUserPoints = useUpdateUserPoints();
    const { updateSelectedGame, userProfileInformation, updateUserProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;

    const [isRollingDice, setIsRollingDice] = useState(false);
    const [randomNumber, setRandomNumber] = useState<Array<number>>([]);
    const [rolledNumbers, setRolledNumbers] = useState<Array<number>>([]);
    const [wonPoints, setWonPoints] = useState<number>();
    const [wonTon, setWonTon] = useState<number>();
    const [wonNft, setWonNft] = useState<number>();
    const [rollsLeft, setRollsLeft] = useState(20);

    const rollDice = (multiplier?: number) => {
        setIsRollingDice(true);
        setWonPoints(undefined);

        // const random = Math.random();
        // let number;

        // if (random < 0.01) {
        //     number = 6; // 1% chance
        // } else if (random < 0.51) {
        //     number = 1; // 90% chance
        // } else if (random < 0.81) {
        //     number = Math.random() < 0.5 ? 2 : 3; // 60% chance for 2 or 3
        // } else if (random < 0.91) {
        //     number = Math.random() < 0.5 ? 4 : 5; // 50% chance for 4 or 5
        // } else {
        //     number = 1; // Fallback to 1
        // }

        // const generateRandomNumber = () => {
        //     const random = Math.random();
        //     if (random < 0.85) return 1; // Face 1: 85% chance
        //     if (random < 0.85 + 0.10) return 2; // Face 2: 10% chance
        //     if (random < 0.85 + 0.10 + 0.04) return 3; // Face 3: 4% chance
        //     if (random < 0.85 + 0.10 + 0.04 + 0.007) return 4; // Face 4: 0.7% chance
        //     if (random < 0.85 + 0.10 + 0.04 + 0.007 + 0.002) return 5; // Face 5: 0.2% chance
        //     return 6; // Face 6: Remaining 0.1% chance
        //     // if (random < 0.01) return 6; // 1% chance
        //     // if (random < 0.51) return 1; // 90% chance
        //     // if (random < 0.81) return Math.random() < 0.5 ? 2 : 3; // 60% chance for 2 or 3
        //     // if (random < 0.91) return Math.random() < 0.5 ? 4 : 5; // 50% chance for 4 or 5
        //     // return 1; // Fallback to 1
        // };

        let rollCount = 0;

        const generateRandomNumber = () => {
            rollCount += 1; // Increment roll count each time a dice roll happens
            const random = Math.random();

            // Regular faces (1-3) are available from the start
            if (random < 0.85) return 1; // Face 1: 85% chance
            if (random < 0.85 + 0.10) return 2; // Face 2: 10% chance
            if (random < 0.85 + 0.10 + 0.04) return 3; // Face 3: 4% chance

            // Introduce rarer faces based on roll count
            if (rollCount >= 143 && random < 0.85 + 0.10 + 0.04 + 0.007) return 4; // Face 4: 0.7% chance
            if (rollCount >= 500 && random < 0.85 + 0.10 + 0.04 + 0.007 + 0.002) return 5; // Face 5: 0.2% chance
            if (rollCount >= 1000 && random < 0.85 + 0.10 + 0.04 + 0.007 + 0.002 + 0.001) return 6; // Face 6: 0.1% chance

            // If none match, return one of the more common faces
            return 1;
        };

        if (multiplier) {
            const newNumbers = Array.from({ length: multiplier }, generateRandomNumber);
            setRandomNumber(newNumbers);
            setRolledNumbers(newNumbers);
        } else {
            const number = generateRandomNumber();
            setRandomNumber([number]);
            setRolledNumbers([number]);
        }
    };

    // const generateRandomNumber = () => {
    //     const random = Math.random();
    //     if (random < 0.85) return 1; // Face 1: 85% chance
    //     if (random < 0.85 + 0.10) return 2; // Face 2: 10% chance
    //     if (random < 0.85 + 0.10 + 0.04) return 3; // Face 3: 4% chance
    //     if (random < 0.85 + 0.10 + 0.04 + 0.007) return 4; // Face 4: 0.7% chance
    //     if (random < 0.85 + 0.10 + 0.04 + 0.007 + 0.002) return 5; // Face 5: 0.2% chance
    //     return 6; // Face 6: Remaining 0.1% chance
    //     // if (random < 0.01) return 6; // 1% chance
    //     // if (random < 0.51) return 1; // 90% chance
    //     // if (random < 0.81) return Math.random() < 0.5 ? 2 : 3; // 60% chance for 2 or 3
    //     // if (random < 0.91) return Math.random() < 0.5 ? 4 : 5; // 50% chance for 4 or 5
    //     // return 1; // Fallback to 1
    // };

    // // Simulate multiple rolls and track results
    // const simulateRolls = (multiplier: number) => {
    //     const rollResults = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    //     for (let i = 0; i < multiplier; i++) {
    //         const roll = generateRandomNumber();
    //         rollResults[roll] += 1;
    //     }

    //     console.log(`After ${multiplier} rolls:`);
    //     console.log(`Face 1 (2000 points): ${rollResults[1]} times`);
    //     console.log(`Face 2 (15,000 points): ${rollResults[2]} times`);
    //     console.log(`Face 3 (50,000 points): ${rollResults[3]} times`);
    //     console.log(`Face 4 (2 TON): ${rollResults[4]} times`);
    //     console.log(`Face 5 (7.5 TON): ${rollResults[5]} times`);
    //     console.log(`Face 6 (NFT): ${rollResults[6]} times`);
    // };

    const diceElement = useRef<HTMLDivElement>(null);

    const handleUpdateUserPoints = async (points: number, wonTon?: number, wonNft?: number) => {

        const data: PointsUpdateRequest = {
            points,
            game: Game.Dice,
            ton: wonTon,
            nft: wonNft,
            userId: userProfileInformation?.userId as string
        };
        console.log("🚀 ~ handleUpdateUserPoints ~ data:", data)

        await updateUserPoints(data)
            .then((response) => {
                console.log("🚀 ~ .then ~ response:", response);

                setTimeout(() => {
                    updateUserProfileInformation(response.data);
                }, 4050);
            })
            .catch((error) => {
                console.log("🚀 ~ .catch ~ error:", error)
            })
    }

    useEffect(() => {
        if (randomNumber.length == 0) return;

        const animateDice = () => {
            if (!diceElement.current) {
                return;
            }

            diceElement.current.style.animation = 'rolling 4s ease-in-out';

            setTimeout(() => {
                if (!diceElement.current) {
                    return;
                }
                switch (randomNumber[0]) {
                    case 1:
                        diceElement.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
                        break;
                    case 6:
                        diceElement.current.style.transform = 'rotateX(180deg) rotateY(0deg)';
                        break;
                    case 2:
                        diceElement.current.style.transform = 'rotateX(-90deg) rotateY(0deg)';
                        break;
                    case 5:
                        diceElement.current.style.transform = 'rotateX(90deg) rotateY(0deg)';
                        break;
                    case 3:
                        diceElement.current.style.transform = 'rotateX(0deg) rotateY(90deg)';
                        break;
                    case 4:
                        diceElement.current.style.transform = 'rotateX(0deg) rotateY(-90deg)';
                        break;
                    default:
                        break;
                }
                diceElement.current.style.animation = 'none';

                setIsRollingDice(false);
                setRandomNumber([]);
                setRollsLeft(() => rollsLeft - rolledNumbers.length);
            }, 4050);
        };

        animateDice();
    }, [randomNumber]);

    useEffect(() => {
        if (rolledNumbers.length == 0) return;

        const calculatePoints = async () => {
            // get the cummulative points
            const points = rolledNumbers.reduce((acc, curr) => {
                const point = pointsMappings.find(point => point.diceRoll == curr)?.points;
                return acc + (point ?? 0);
            }, 0);

            // check if there is a ton or nft
            const ton = rolledNumbers.find(number => pointsMappings.find(point => point.diceRoll == number)?.ton);
            const nft = rolledNumbers.find(number => pointsMappings.find(point => point.diceRoll == number)?.nft);

            console.log("🚀 ~ points ~ points:", points)
            console.log("🚀 ~ calculatePoints ~ ton:", ton)
            console.log("🚀 ~ calculatePoints ~ nft:", nft)

            // find the total ton and nft won
            const wonTon = ton ? rolledNumbers.reduce((acc, curr) => {
                const ton = pointsMappings.find(point => point.diceRoll == curr)?.ton;
                return acc + (ton ?? 0);
            }, 0) : undefined;
            const wonNft = nft ? rolledNumbers.reduce((acc, curr) => {
                const nft = pointsMappings.find(point => point.diceRoll == curr)?.nft;
                return acc + (nft ?? 0);
            }, 0) : undefined;

            // const wonTon = ton ? pointsMappings.find(point => point.diceRoll == ton)?.ton as number : undefined;
            // const wonNft = nft ? pointsMappings.find(point => point.diceRoll == nft)?.nft as number : undefined;

            console.log("🚀 ~ wonTon ~ wonTon:", wonTon)
            console.log("🚀 ~ wonNft ~ wonNft:", wonNft)

            setWonPoints(points);
            setWonTon(wonTon);
            setWonNft(wonNft);

            await handleUpdateUserPoints(points, wonTon, wonNft);
        };

        // calculate points
        calculatePoints();

        // cleanup
        return () => {
            setRolledNumbers([]);
        }
    }, [rolledNumbers]);

    return (
        <main className="flex min-h-screen flex-col items-center py-20 pt-12 pb-32 select-none relative">
            <button
                className={`${Styles.OrangeBgLinkButton} mb-5 w-full`}
                onClick={() => updateSelectedGame(Game.Tap)}>
                Play Tap To Earn
            </button>
            <div className="flex flex-col items-center mb-10 z-10">
                <p className="text-sm text-white/50">Points</p>
                <div className="flex flex-row gap-2 items-center mb-2">
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
                </div>
                <div>
                    <div className="flex flex-row gap-2 items-center text-white/80 mb-4">
                        <div className="flex flex-row items-center gap-2 p-2 px-3 pr-2 bg-white/10 rounded-3xl">
                            <p>{userProfileInformation?.tonEarned} TON</p>
                            <span><Icons.Ton fill="#fff" className="w-5 h-5" /></span>
                        </div>
                        <div className="flex flex-row items-center gap-2 p-2 px-3 pr-2 bg-white/10 rounded-3xl">
                            <p>{userProfileInformation?.nftEarned} NFT</p>
                            <span><Icons.Ton fill="#fff" className="w-5 h-5" /></span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center text-white/80">
                        <Link href="/wallet" className="flex flex-col items-center gap-0 p-4 py-3 bg-white/10 rounded-2xl">
                            <Icons.Wallet />
                            <p>Purchase</p>
                        </Link>
                        <div className="flex flex-col items-center gap-0 p-4 py-3 bg-white/10 rounded-2xl">
                            <Icons.Withdraw />
                            <p>Witdraw</p>
                        </div>
                    </div>
                </div>
            </div>
            <motion.div
                animate={{
                    scale: isRollingDice ? 0.85 : 1
                }}
                className={`container !rounded-full mx-auto p-4 pt-6 mb-5 md:p-6 lg:p-12 border-8 border-orange-400/20 ${isRollingDice ? '[box-shadow:0_0px_40px_5px_#ff954a7a,0_0px_0_0_#ff954a3c]' : ''}`}>
                <div className="dice flex justify-center mb-4" ref={diceElement}>
                    <div className="face front"></div>
                    <div className="face back"></div>
                    <div className="face top"></div>
                    <div className="face bottom"></div>
                    <div className="face right"></div>
                    <div className="face left"></div>
                </div>
            </motion.div>

            {/* <Button
                disabled={isRollingDice || rollsLeft == 0}
                onClick={() => rollDice()}
                className="!w-fit mb-3 button !bg-orange-500 !text-white  cursor-pointer select-none
                active:translate-y-2  active:[box-shadow:0_0px_0_0_#ff964a,0_0px_0_0_#ff954a3c]
                active:border-b-[0px]
                transition-all duration-150 [box-shadow:0_8px_0_0_#ff964a,0_15px_0_0_#ff954a3c]
                !rounded-full border-[1px] border-orange-400">
                <h2>Roll Dice</h2>
            </Button> */}

            {wonPoints ? <motion.span
                key={wonPoints}
                initial={{ scale: 3, opacity: 0, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{ delay: 2.5 }}
                className={`${wonPoints ? 'bg-green-300/20' : ''} p-1 px-2 text-sm text-green-400 rounded-lg mb-3`}>
                {wonPoints ? <>+{wonPoints.toLocaleString()}</> : <></>}
            </motion.span> : <span className="h-[28px] mb-3"></span>}

            <div className="flex flex-col items-center">
                <Button
                    disabled={isRollingDice || rollsLeft == 0}
                    onClick={() => rollDice()}
                    // onClick={() => simulateRolls(100)}
                    className="!w-fit mb-3 !bg-orange-500 !text-white">
                    <h2>Roll Dice</h2>
                </Button>
                <div className="flex flex-row gap-2">
                    <Button
                        disabled={isRollingDice || rollsLeft < 5}
                        onClick={() => rollDice(5)}
                        className="!w-fit mb-3">
                        <h2>Roll x5</h2>
                    </Button>
                    <Button
                        disabled={isRollingDice || rollsLeft < 10}
                        onClick={() => rollDice(10)}
                        className="!w-fit mb-3">
                        <h2>Roll x10</h2>
                    </Button>
                </div>
            </div>
            <p className="text-white">{rollsLeft} {rollsLeft > 1 ? 'rolls' : 'roll'} left.</p>
            {
                rolledNumbers.length > 1 &&
                <div className="my-3 mt-5 flex flex-col items-center w-full gap-2 bg-white/5 p-4 pb-5 rounded-2xl">
                    <p className="text-white font-semibold">Multi-roll points</p>
                    <div className="flex flex-row flex-wrap gap-2 w-full justify-between">
                        <AnimatePresence>
                            {
                                !isRollingDice && rolledNumbers.map((number, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.15, delay: 0.15 * index }}
                                        // viewport={{ once: true }}
                                        className="bg-white text-orange-500 text-xl w-12 h-12 rounded-full grid place-items-center border-2 border-orange-300">
                                        {number}
                                    </motion.span>
                                ))
                            }
                        </AnimatePresence>
                        {/* <span className="bg-white text-orange-500 text-xl w-12 h-12 rounded-full grid place-items-center border-2 border-orange-300">3</span>
                    <span className="bg-white text-orange-500 text-xl w-12 h-12 rounded-full grid place-items-center border-2 border-orange-300">3</span>
                    <span className="bg-white text-orange-500 text-xl w-12 h-12 rounded-full grid place-items-center border-2 border-orange-300">3</span>
                    <span className="bg-white text-orange-500 text-xl w-12 h-12 rounded-full grid place-items-center border-2 border-orange-300">3</span>
                    <span className="bg-white text-orange-500 text-xl w-12 h-12 rounded-full grid place-items-center border-2 border-orange-300">3</span> */}
                    </div>
                </div>
            }
        </main>
    );
}

export default Dicepage;