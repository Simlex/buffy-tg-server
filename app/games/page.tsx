import { FunctionComponent, ReactElement } from "react";
import GamesPage from "./GamesPage";

interface GamesProps {

}

const Games: FunctionComponent<GamesProps> = (): ReactElement => {
    return (
        <GamesPage />
    );
}

export default Games;