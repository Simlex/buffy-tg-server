"use client"
import { ReactElement, FunctionComponent, useContext } from "react"
import Image from "next/image";
import images from "@/public/images";
import Link from "next/link";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";


const Homepage: FunctionComponent = (): ReactElement => {

    const { userProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;

    return (
        <main className="flex min-h-screen flex-col items-center py-20 pb-32 select-none relative">
            <div className="flex flex-col items-center mb-10 z-10">
                {/* <div>
                    {user.first_name && <h1 className="text-white text-3xl font-bold">{`Hello, ${user.first_name}`}</h1>}
                    {user.id && <p className="text-white/50">{`User ID: ${user.id}`}</p>}
                    {user.last_name && <p className="text-white/50">{`Last Name: ${user.last_name}`}</p>}
                    {user.username && <p className="text-white/50">{`Username: ${user.username}`}</p>}
                </div> */}
                <span className="w-40 h-40 relative mb-5">
                    <Image src={images.coin} className="w-full h-full object-contain" alt="Buffy" />
                </span>
                <p className="text-sm text-white/50">Total Points</p>
                <h1 className="text-[40px] text-white font-extrabold">{(userProfileInformation?.totalPoints ?? 0).toLocaleString()}</h1>
            </div>
            <div className="flex flex-col gap-2 w-full mt-auto mb-12">
                <p className="text-white/50">Get more points</p>
                <Link href={"/games"} className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-center font-bold py-3 px-4 shadow rounded-xl hover:from-orange-500 hover:to-orange-700 transition duration-300">Play Games</Link>
                <Link href={"/trivia"} className="bg-white text-gray-900 text-center font-bold py-3 px-4 shadow rounded-xl hover:from-orange-500 hover:to-orange-700 transition duration-300">Daily Trivia</Link>
            </div>
        </main>
    );
}

export default Homepage;