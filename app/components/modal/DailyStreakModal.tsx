import React, { useContext } from 'react'
import ModalWrapper from './ModalWrapper'
import { Icons } from '../ui/icons'
import { motion } from "framer-motion"
import { ApplicationContext, ApplicationContextData } from '@/app/context/ApplicationContext'
import { RollsStreakConfig } from '@/app/constants/rollsStreakConfig'

interface Props {
    visibility: boolean
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DailyStreakModal({ visibility, setVisibility }: Props) {
    const { userProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;

    // get the date the streak would expire - 24 hours from the time the user claimed the roll
    // const streakExpiryDate = new Date().setHours(new Date().getHours() + 24);

    // check if streak has expired
    // const streakHasExpired =
    //     userProfileInformation?.dailyFreeDiceRollsNextClaimableDateExp &&
    //     new Date(userProfileInformation.dailyFreeDiceRollsNextClaimableDateExp) < new Date();

    // check if the user is a premium user
    const isPremiumUser = userProfileInformation?.isSubscribedToPremium;

    // check if the user is still within their premium subscription period
    const isWithinPremiumSubscriptionPeriod =
        isPremiumUser &&
        userProfileInformation?.premiumSubscriptionExp &&
        new Date(userProfileInformation.premiumSubscriptionExp) > new Date();

    // assign a variable that specifies that a user is a valid premium user
    const isValidPremiumUser = isPremiumUser && isWithinPremiumSubscriptionPeriod;

    const premiumUserRolls = RollsStreakConfig.Premium;
    const normalUserRolls = RollsStreakConfig.Normal;

    const userDailyRollsStreak = userProfileInformation?.dailyFreeDiceRollsStreak ? userProfileInformation.dailyFreeDiceRollsStreak - 1 : 0;

    // const addedRolls = streakHasExpired ?
    //     isValidPremiumUser ? premiumUserRolls : normalUserRolls
    //     : isValidPremiumUser ? premiumUserRolls + userDailyRollsStreak : normalUserRolls + userDailyRollsStreak;

    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            <div className='bg-white p-5 rounded-3xl flex flex-col'>
                <div className='flex flex-row justify-center items-center mb-2'>
                    <h3 className='text-2xl'>Daily Streak Bonus</h3>
                    <span onClick={() => setVisibility(false)} className='ml-auto w-10 h-10 grid place-items-center rounded-full bg-red-500/5 cursor-pointer'>
                        <Icons.CloseIcon fill='#ed1000' />
                    </span>
                </div>
                <p className='mb-5 text-black/50'>
                    You are now on a {userProfileInformation?.dailyFreeDiceRollsStreak} day streak! Keep it up to earn more rolls!
                </p>
                <motion.h1
                    initial={{ scale: 2, opacity: 0, filter: "blur(2px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.25, duration: 0.35 }}
                    className='text-4xl font-bold text-center mb-5'>
                    +{normalUserRolls + userDailyRollsStreak} {userDailyRollsStreak > 1 ? 'Rolls' : 'Roll'}
                </motion.h1>
                {isValidPremiumUser ? <span className='text-center bg-[#24A1DE] p-3 rounded-xl text-white'>+{premiumUserRolls} points from premium subscription</span> : <></>}
            </div>
        </ModalWrapper>
    )
}