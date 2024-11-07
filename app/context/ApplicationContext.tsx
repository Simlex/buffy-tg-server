import { FunctionComponent, MutableRefObject, ReactNode, createContext, useRef, useState } from "react";
import { UserProfileInformation } from "../models/IUser";
import { StorageKeys } from "../constants/storageKeys";
import { fetchUserFromDb } from "../api/services/fetchUserFromDb";
import { Game } from "../enums/Game";


// Define the type for the context data
export interface ApplicationContextData {
    isFetchingUserProfile: boolean;
    userProfileInformation: UserProfileInformation | null;
    updateUserProfileInformation: (user: UserProfileInformation) => void;
    fetchUserProfileInformation: () => void;
    displayToast: (message: string, type: "success" | "error" | "info" | "warning") => void;
    isUserLoginPromptVisible: boolean;
    toggleUserLoginPrompt: () => void;
    nextUpdateTimestamp: number;
    updateNextUpdateTimestamp: (timestamp: number) => void;
    timeLeft: string;
    updateTimeLeft: (time: string) => void;
    timesClickedPerSession: number | undefined;
    updateTimesClickedPerSession: (times: number) => void;
    selectedGame: Game;
    updateSelectedGame: (game: Game) => void;
    taps: number;
    setTaps: (taps: number) => void;
    didInitialLoad: MutableRefObject<boolean>
};

// Create a context with the specified data type
const ApplicationContext = createContext<ApplicationContextData | undefined>(undefined);

// Create a provider component that takes children as props
interface AppProviderProps {
    children: ReactNode;
};

const AppProvider: FunctionComponent<AppProviderProps> = ({ children }) => {

    // Define state for customer data
    const [userProfileInformation, setUserProfileInformation] = useState<UserProfileInformation | null>(null);
    const [isFetchingUserProfileInformation, setIsFetchingUserProfileInformation] = useState(false);
    const [nextUpdateTimestamp, setNextUpdateTimestamp] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [timesClickedPerSession, setTimesClickedPerSession] = useState<number>();
    const [taps, setTaps] = useState<number>(0);
    const didInitialLoad = useRef(false); // New ref to track initial load

    // Define state for displaying login prompt
    const [showUserLoginPrompt, setShowUserLoginPrompt] = useState(false);

    // Define state for selected game
    const [selectedGame, setSelectedGame] = useState<Game>(Game.Dice);

    // Define function to display toast
    const displayToast = (message: string) => {
        alert(message);
    };

    /**
     * Function to fetch user's profile information
     */
    const handleFetchUserInformation = async () => {

        // Set loader to true
        setIsFetchingUserProfileInformation(true);

        // Check session storage for user information
        const _userInfo = JSON.parse(sessionStorage.getItem(StorageKeys.UserInformation) as string);

        if (_userInfo !== null || _userInfo !== undefined) {

            const user = await fetchUserFromDb(_userInfo.userId);

            // Set the user information
            setUserProfileInformation(user);

            // Set tap points
            setTaps(user.tapPoints || 0);
        };
    };

    // Define the values you want to share
    const sharedData: ApplicationContextData = {
        isFetchingUserProfile: isFetchingUserProfileInformation,
        userProfileInformation,
        updateUserProfileInformation: (user: UserProfileInformation) => setUserProfileInformation(user),
        fetchUserProfileInformation: handleFetchUserInformation,
        displayToast,
        isUserLoginPromptVisible: showUserLoginPrompt,
        toggleUserLoginPrompt: () => setShowUserLoginPrompt(!showUserLoginPrompt),
        nextUpdateTimestamp,
        updateNextUpdateTimestamp: (timestamp: number) => setNextUpdateTimestamp(timestamp),
        timeLeft,
        updateTimeLeft: (time: string) => setTimeLeft(time),
        timesClickedPerSession,
        updateTimesClickedPerSession: (times: number) => setTimesClickedPerSession(times),
        selectedGame,
        updateSelectedGame: (game: Game) => setSelectedGame(game),
        taps,
        setTaps,
        didInitialLoad
    };

    return (
        <ApplicationContext.Provider value={sharedData}>
            {children}
        </ApplicationContext.Provider>
    );
};

export { AppProvider, ApplicationContext };
