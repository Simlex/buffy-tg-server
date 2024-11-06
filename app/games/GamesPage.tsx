'use client'
import { FunctionComponent, ReactElement, useContext, useState } from "react";
import Dicepage from "./Dicepage";
import Tappage from "./Tappage";
import { Game } from "../enums/Game";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";

interface GamesPageProps {

}

const GamesPage: FunctionComponent<GamesPageProps> = (): ReactElement => {

    const { selectedGame } = useContext(ApplicationContext) as ApplicationContextData;

    return (
        <>
            {
                selectedGame === Game.Dice ? <Dicepage /> : <Tappage />
            }
        </>
    );
}

export default GamesPage;