'use client'
import { FunctionComponent, ReactElement, useContext } from "react";
import Dicepage from "./Dicepage";
import Tappage from "./Tappage";
import { Game } from "../enums/Game";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import Button from "../components/ui/button";
import Image from "next/image";
import images from "@/public/images";


const GamesPage: FunctionComponent = (): ReactElement => {

    const { selectedGame, updateSelectedGame } = useContext(ApplicationContext) as ApplicationContextData;

    return (
        <>
            {
                !selectedGame &&
                <main className="flex min-h-screen flex-col items-center py-20 pt-12 pb-32 select-none relative">
                    <div className="flex flex-col gap-0 text-white w-full mb-8">
                        <h2 className="text-2xl font-semibold">Games</h2>
                        <p className="text-white/80">Play to earn more points</p>
                    </div>

                    <div className="w-full flex flex-col gap-5">
                        <div className="rounded-2xl overflow-hidden flex flex-col">
                            <div className="w-full h-40 bg-black/50 grid place-items-center relative">
                                <div className='w-full h-full scale-[1] absolute top-0 left-0 pointer-events-none opacity-5 bg-[url(/images/pattern.png)] bg-center bg-cover bg-fixed bg-no-repeat'></div>
                                <span className="w-24 h-24 block relative overflow-hidden">
                                    <Image src={images.dice} alt="Dice clicker" className="w-full h-full object-contain" />
                                </span>
                            </div>
                            <div className="p-3 py-4 text-white bg-black/20">
                                <h3 className="text-lg">Dice Roll</h3>
                                <p className="mb-3 text-white/60">
                                    Roll the dice and test your luck! Win points, and other prizes with every throw.
                                </p>
                                <Button className="bg-white text-black" onClick={() => updateSelectedGame(Game.Dice)}>
                                    Play
                                </Button>
                            </div>
                        </div>
                        {/* <div className="rounded-2xl overflow-hidden flex flex-col">
                            <div className="w-full h-40 bg-black/50 grid place-items-center relative">
                                <div className='w-full h-full scale-[1] absolute top-0 left-0 pointer-events-none opacity-5 bg-[url(/images/pattern.png)] bg-center bg-cover bg-fixed bg-no-repeat'></div>
                                <span className="w-24 h-24 block relative overflow-hidden">
                                    <Image src={images.clicker} alt="Dice clicker" className="w-full h-full object-contain" />
                                </span>
                            </div>
                            <div className="p-3 py-4 text-white bg-black/20">
                                <h3 className="text-lg">Tap To Earn</h3>
                                <p className="mb-3 text-white/60">
                                    Tap your way to rewards! Keep tapping and keep winning!
                                </p>
                                <Button className="bg-white text-black" onClick={() => updateSelectedGame(Game.Tap)}>
                                    Play
                                </Button>
                            </div>
                        </div> */}
                    </div>
                </main>
            }
            {
                selectedGame === Game.Dice && <Dicepage /> 
            }
            {
                selectedGame === Game.Tap && <Tappage /> 
            }
        </>
    );
}

export default GamesPage;