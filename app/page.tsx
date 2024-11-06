"use client"
import Homepage from "./homepage/Homepage";

export default function Home() {
    // useEffect(() => {
    //     // Check if Telegram WebApp is available
    //     if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    //         const tg = window.Telegram.WebApp;

    //         if (tg.BiometricManager.isInited) {
    //             tg.HapticFeedback.impactOccurred("light");
    //             !tg.BiometricManager.isAccessRequested &&
    //                 tg.BiometricManager.requestAccess({
    //                     reason: "Biometric Access",
    //                 }, (granted) => {
    //                     if (granted) {
    //                         tg.BiometricManager.authenticate({
    //                             reason: "Biometric Access",
    //                         }, (success, token) => {
    //                             if (success) {
    //                                 console.log("🚀 ~ Home ~ token:", token)
    //                             }
    //                         })
    //                     }
    //                 });
    //         }
    //     }
    // }, []);
    return (
        <Homepage />
    );
}
