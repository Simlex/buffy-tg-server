"use client"
import { ReactElement, FunctionComponent, useState, useEffect, useRef } from "react"
import Button from "../components/ui/button";
import { motion } from "framer-motion";
import images from "@/public/images";
import Image from "next/image";
import { image } from "framer-motion/client";


const Homepage: FunctionComponent = (): ReactElement => {

    const [isRollingDice, setIsRollingDice] = useState(false);
    const [randomNumber, setRandomNumber] = useState(0);
    const [rollsLeft, setRollsLeft] = useState(5);

    const rollDice = () => {
        setIsRollingDice(true);

        // const random = Math.floor(Math.random() * 10);
        const random = Math.random();
        let number;

        // if (random >= 1 && random <= 6) {
        //     setRandomNumber(random);
        // } else {
        //     rollDice();
        // }

        if (random < 0.01) {
            number = 6; // 1% chance
        } else if (random < 0.51) {
            number = 1; // 90% chance
        } else if (random < 0.81) {
            number = Math.random() < 0.5 ? 2 : 3; // 60% chance for 2 or 3
        } else if (random < 0.91) {
            number = Math.random() < 0.5 ? 4 : 5; // 50% chance for 4 or 5
        } else {
            number = 1; // Fallback to 1
        }

        setRandomNumber(number);
    };

    const diceElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (randomNumber == 0) return;

        const animateDice = () => {
            if (!diceElement.current) {
                return;
            }

            diceElement.current.style.animation = 'rolling 4s ease-in-out';

            setTimeout(() => {
                if (!diceElement.current) {
                    return;
                }
                switch (randomNumber) {
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
                setRandomNumber(0);
                setRollsLeft(() => rollsLeft - 1);
            }, 4050);
        };

        animateDice();
    }, [randomNumber]);

    return (
        <main className="flex min-h-screen flex-col items-center py-20 pb-32 select-none relative">
            <div className="flex flex-col items-center mb-10 z-10">
                <p className="text-sm text-white/50">Total Points</p>
                <h1 className="text-[40px] text-white font-extrabold">{'20,000k'}</h1>
            </div>
            <motion.div
                animate={{
                    scale: isRollingDice ? 0.85 : 1
                }}
                className="container !rounded-full mx-auto p-4 pt-6 mb-8 md:p-6 lg:p-12 border-8 border-orange-400/20">
                <div className="dice flex justify-center mb-4" ref={diceElement}>
                    <div className="face front"></div>
                    <div className="face back"></div>
                    <div className="face top"></div>
                    <div className="face bottom"></div>
                    <div className="face right"></div>
                    <div className="face left"></div>
                </div>
            </motion.div>
            <Button
                disabled={isRollingDice || rollsLeft == 0}
                onClick={() => rollDice()}
                className="!w-fit mb-3">
                <h2>Roll Dice</h2>
            </Button>
            <p className="text-white">{rollsLeft} rolls left for today.</p>
        </main>
    );
}

export default Homepage;