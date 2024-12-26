"use client"
import { FunctionComponent, ReactElement, useContext, useMemo, useState } from "react";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import Button from "../components/ui/button";
import Link from "next/link";

const ReferPage: FunctionComponent = (): ReactElement => {

    const { userProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;
    const [isLinkCopied, setIsLinkCopied] = useState(false);

    const copyLink = (link: string) => {
        try {
            navigator.clipboard.writeText(link);
            setIsLinkCopied(true);
        } catch (error) {
            console.error("Copying to clipboard failed:", error);
        }
    };

    useMemo(() => {
        if (isLinkCopied) {
            setTimeout(() => {
                setIsLinkCopied(false);
            }, 3000);
        }
    }, [isLinkCopied]);

    const userLink = `https://t.me/BuffyDurov_bot?start=${userProfileInformation?.username}${userProfileInformation?.userId}`;

    return (
        <main className="flex min-h-screen flex-col items-center py-20">
            <h2 className="text-white font-medium text-3xl">Refer</h2>

            <div className="flex flex-col items-center my-3 w-full mb-8">
                <p className={`text-white text-center ${isLinkCopied ? "text-orange-400" : ""}`}>{userLink}</p>
                <Button
                    className={isLinkCopied ? "opacity-70" : "opacity-100 bg-orange-400 text-dark-grey w-32 mt-3"}
                    onClick={() => copyLink(userLink)}>
                    {isLinkCopied ? "Copied!" : "Copy Link"}
                </Button>
                <Link
                    href={"/referral-board"}
                    className="bg-gradient-to-r from-orange-400 to-orange-600 text-white w-full mt-4 text-center font-medium py-3 px-4 shadow rounded-xl hover:from-orange-500 hover:to-orange-700 transition duration-300">
                    See Referral Leaderboard
                </Link>
            </div>

            {
                userProfileInformation && userProfileInformation.referralCount ?
                    <>
                        <div className="text-white flex flex-col items-center mb-2">
                            <h3 className="text-2xl font-medium text-slate-400">Number of referrals</h3>
                            <span className="text-2xl">{userProfileInformation.referralCount}</span>
                        </div>
                        <div className="text-white flex flex-col items-center">
                            <h3 className="text-2xl font-medium text-slate-400">Referral points</h3>
                            <span className="text-2xl">{userProfileInformation.referralCount * 1000}</span>
                        </div>
                    </> : <></>
            }
            {
                userProfileInformation && userProfileInformation.referralContestCount ?
                    <>
                        <div className="text-white flex flex-col items-center mt-4">
                            <h3 className="text-2xl font-medium text-slate-400">Number of Contest Referrals</h3>
                            <span className="text-2xl">{userProfileInformation.referralContestCount}</span>
                        </div>
                        <div className="text-white flex flex-col items-center">
                            <h3 className="text-2xl font-medium text-slate-400">Contest points</h3>
                            <span className="text-2xl">{userProfileInformation.referralContestCount * 1000}</span>
                        </div>
                    </> : <></>
            }
        </main>
    );
}

export default ReferPage;