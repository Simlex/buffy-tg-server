"use client"
import { ReactElement, FunctionComponent, useState, useEffect, useRef, useContext } from "react"
import Button from "../components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Styles } from "../styles/styles";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { Game } from "../enums/Game";


const Dicepage: FunctionComponent = (): ReactElement => {

    const { updateSelectedGame, userProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;
    console.log("🚀 ~ userProfileInformation:", userProfileInformation)

    const [isRollingDice, setIsRollingDice] = useState(false);
    const [randomNumber, setRandomNumber] = useState<Array<number>>([]);
    const [rolledNumbers, setRolledNumbers] = useState<Array<number>>([]);
    const [rollsLeft, setRollsLeft] = useState(5);
    // const [rollsMultipliers, setRollsMultipliers] = useState(0);

    const rollDice = (multiplier?: number) => {
        setIsRollingDice(true);

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

        // setRandomNumber([number]);
        const generateRandomNumber = () => {
            const random = Math.random();
            if (random < 0.01) return 6; // 1% chance
            if (random < 0.51) return 1; // 90% chance
            if (random < 0.81) return Math.random() < 0.5 ? 2 : 3; // 60% chance for 2 or 3
            if (random < 0.91) return Math.random() < 0.5 ? 4 : 5; // 50% chance for 4 or 5
            return 1; // Fallback to 1
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

    const diceElement = useRef<HTMLDivElement>(null);

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
                setRollsLeft(() => rollsLeft - 1);
            }, 4050);
        };

        animateDice();
    }, [randomNumber]);

    return (
        <main className="flex min-h-screen flex-col items-center py-20 pt-12 pb-32 select-none relative">
            <button
                className={`${Styles.OrangeBgLinkButton} mb-5 w-full`}
                onClick={() => updateSelectedGame(Game.Tap)}>
                Play Tap To Earn
            </button>
            <div className="flex flex-col items-center mb-10 z-10">
                <p className="text-sm text-white/50">Total Points</p>
                <h1 className="text-[40px] text-white font-extrabold">{(userProfileInformation?.diceRollsPoints ?? 0).toLocaleString()}</h1>
            </div>
            <motion.div
                animate={{
                    scale: isRollingDice ? 0.85 : 1
                }}
                className={`container !rounded-full mx-auto p-4 pt-6 mb-8 md:p-6 lg:p-12 border-8 border-orange-400/20 ${isRollingDice ? '[box-shadow:0_0px_40px_5px_#ff954a7a,0_0px_0_0_#ff954a3c]' : ''}`}>
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
            <div className="flex flex-col items-center">
                <Button
                    disabled={isRollingDice || rollsLeft == 0}
                    onClick={() => rollDice()}
                    className="!w-fit mb-3 !bg-orange-500 !text-white">
                    <h2>Roll Dice</h2>
                </Button>
                <div className="flex flex-row gap-2">
                    <Button
                        disabled={isRollingDice || rollsLeft == 0}
                        onClick={() => rollDice(5)}
                        className="!w-fit mb-3">
                        <h2>Roll x5</h2>
                    </Button>
                    <Button
                        disabled={isRollingDice || rollsLeft == 0}
                        onClick={() => rollDice(10)}
                        className="!w-fit mb-3">
                        <h2>Roll x10</h2>
                    </Button>
                </div>
            </div>
            <p className="text-white">{rollsLeft} {rollsLeft > 1 ? 'rolls' : 'roll'} left for today.</p>
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
                                    transition={{ duration: 0.15, delay: 0.25 * index }}
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
        </main>
    );
}

export default Dicepage;