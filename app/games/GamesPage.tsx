'use client'
import { FunctionComponent, ReactElement, useContext } from "react";
import Dicepage from "./Dicepage";
import Tappage from "./Tappage";
import { Game } from "../enums/Game";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";


const GamesPage: FunctionComponent = (): ReactElement => {

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