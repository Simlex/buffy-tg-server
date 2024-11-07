"use client"
import { FunctionComponent, ReactElement, useState } from "react";
import { Styles } from "../styles/styles";
import { motion } from "framer-motion";
import Button from "../components/ui/button";
import ModalWrapper from "../components/modal/ModalWrapper";
import { Icons } from "../components/ui/icons";

const TriviaPage: FunctionComponent = (): ReactElement => {

    const options = ['Hal Finney', 'Satoshi Nakamoto', 'Adam Back', 'David Chaum'];
    const [answer, setAnswer] = useState<string>();

    const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
    const [isPostSubmissionModalVisible, setIsPostSubmissionModalVisible] = useState<boolean>(false);

    const handleSubmitAnswer = async () => {
        setIsSubmittingAnswer(true);

        // const response = await fetch('/api/submit-answer', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ answer }),
        // });

        // if (response.ok) {
        //     setIsBonusClaimedModalVisible(true);
        // } else {
        //     console.error('Failed to submit answer');
        // }

        setTimeout(() => {
            setIsPostSubmissionModalVisible(true);
            setIsSubmittingAnswer(false);
        }, 2500);
    }

    return (
        <>
            <ModalWrapper
                visibility={isPostSubmissionModalVisible}
                setVisibility={setIsPostSubmissionModalVisible}>
                {/* <div className="flex flex-col w-[80vw] items-center bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-5 pt-6 text-white border-b-[1px] border-orange-400">
                    <span className={"mx-auto mb-3 grid place-items-center min-w-10 min-h-10 rounded-full bg-white/20"}>
                        <Icons.Points />
                    </span>
                    <span className=" bg-green-300/20 p-1 px-2 text-sm text-green-400 rounded-lg">+2,500</span>
                    <h3 className="font-semibold text-xl mb-3 text-center">
                        Bonus claimed successfully.
                    </h3>
                    <div className="flex flex-row gap-4 w-full">
                        <button
                            onClick={() => { setIsPostSubmissionModalVisible(false) }}
                            className="w-full p-2 rounded-xl bg-blue-500 focus:bg-blue-600">
                            Okay, Thank you.
                        </button>
                    </div>
                </div> */}
                {/* Wrong answer below */}
                <div className="flex flex-col w-[80vw] items-center bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-5 pt-6 text-white border-b-[1px] border-orange-400">
                    <span className={"mx-auto mb-3 grid place-items-center min-w-10 min-h-10 rounded-full bg-white/0 text-5xl"}>
                        {/* <Icons.CloseFill className="w-10 h-10" fill="#ed1000" /> */}
                        😢
                    </span>
                    <h3 className="font-semibold text-xl mb-3 text-center">
                        Wrong answer, try again tomorrow.
                    </h3>
                    <div className="flex flex-row gap-4 w-full">
                        <button
                            onClick={() => { setIsPostSubmissionModalVisible(false) }}
                            className="w-full p-2 rounded-xl bg-blue-500 focus:bg-blue-600">
                            Ouch, Thank you.
                        </button>
                    </div>
                </div>
            </ModalWrapper>

            <main className="flex min-h-screen flex-col items-center py-20">
                <span className="mb-3">
                    <Icons.Trophy2 className="w-20 h-20" />
                </span>
                <motion.h2
                    initial={{ scale: 3, opacity: 0, filter: "blur(10px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.25, duration: 0.35 }}
                    className="text-white font-medium text-3xl mb-8">
                    Daily Trivia
                </motion.h2>

                <div className="flex flex-col items-center mb-14">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="text-white text-base mb-5">
                        Who was the first person to use Bitcoin?
                    </motion.p>
                    <div className="flex flex-col w-full gap-2 mb-5">
                        {
                            // options.sort(() => Math.random() - 0.5).map((option, index) => (
                            options.map((option, index) => (
                                <motion.button
                                    initial={{ scale: 0.05 * index, opacity: 0, y: -10 * index }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 * index }}
                                    key={index}
                                    onClick={() => setAnswer(option)}
                                    className={`bg-gray-700 rounded-xl p-2 pr-5 hover:bg-gray-600 text-white/80 ${option === answer ? "!bg-white !text-gray-800" : ""}`}>
                                    {option}
                                </motion.button>
                            ))
                        }
                    </div>

                    <Button
                        disabled={!answer || isSubmittingAnswer}
                        onClick={handleSubmitAnswer}
                        isLoading={isSubmittingAnswer}
                        className={`${Styles.OrangeBgLinkButton} disabled:opacity-50`}>
                        Submit
                    </Button>
                </div>
            </main>
        </>
    );
}

export default TriviaPage;