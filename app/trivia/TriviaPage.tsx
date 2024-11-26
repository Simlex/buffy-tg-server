"use client"
import { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { Styles } from "../styles/styles";
import { motion } from "framer-motion";
import Button from "../components/ui/button";
import ModalWrapper from "../components/modal/ModalWrapper";
import { Icons } from "../components/ui/icons";
import { TriviaConfig } from "../constants/triviaConfig";
import { useUpdateUserTriviaPoints } from "../api/apiClient";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { ApplicationError } from "../constants/applicationError";

enum ResultStatus {
    Success,
    Failure,
    Taken
}

const TriviaPage: FunctionComponent = (): ReactElement => {

    const updateUserTriviaPoints = useUpdateUserTriviaPoints();
    const { userProfileInformation, updateUserProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;

    const lastAnsweredTriviaDate = userProfileInformation?.lastAnsweredTriviaDate ? new Date(userProfileInformation.lastAnsweredTriviaDate) : undefined

    const userHasAnsweredTriviaToday = lastAnsweredTriviaDate?.getDate() == (new Date).getDate()
        && lastAnsweredTriviaDate?.getMonth() == (new Date).getMonth() &&
        lastAnsweredTriviaDate?.getFullYear() == (new Date).getFullYear();

    // get the date the trivia started
    const startDate = TriviaConfig.startDate;
    // get the date the trivia ends
    // const endDate = TriviaConfig.endDate;

    // how many days since the trivia started
    const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const triviaEnded = daysSinceStart >= TriviaConfig.questionsAndAnswers.length;

    const question = triviaEnded ? "" : TriviaConfig.questionsAndAnswers[daysSinceStart].question;
    const options = triviaEnded ? [] : TriviaConfig.questionsAndAnswers[daysSinceStart].options;

    const [answer, setAnswer] = useState<string>();

    const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
    const [isPostSubmissionModalVisible, setIsPostSubmissionModalVisible] = useState<boolean>(false);
    const [resultStatus, setResultStatus] = useState<ResultStatus>();

    const handleSubmitAnswer = async () => {
        setIsSubmittingAnswer(true);

        if (answer == TriviaConfig.questionsAndAnswers[daysSinceStart].answer) {
            // send a request to the server to update the user's points
            await updateUserTriviaPoints(userProfileInformation?.userId as string, { points: TriviaConfig.dailyTriviaPoints })
                .then((response) => {
                    console.log("🚀 ~ .then ~ response:", response);
                    setResultStatus(ResultStatus.Success);
                    updateUserProfileInformation(response.data);
                })
                .catch((error) => {
                    if (error.response?.data.errorCode == ApplicationError.UserAlreadyAnsweredTrivia.Code) {
                        setResultStatus(ResultStatus.Taken);
                    }
                    console.log("🚀 ~ .catch ~ error:", error);
                })
                .finally(() => {
                    setIsPostSubmissionModalVisible(true);
                    setIsSubmittingAnswer(false);
                })
        }
        else {
            await updateUserTriviaPoints(userProfileInformation?.userId as string, { points: 0 })
                .then((response) => {
                    console.log("🚀 ~ .then ~ response:", response);
                    setResultStatus(ResultStatus.Success);
                    updateUserProfileInformation(response.data);
                })
            setIsPostSubmissionModalVisible(true);
            setIsSubmittingAnswer(false);
            setResultStatus(userHasAnsweredTriviaToday ? ResultStatus.Taken : ResultStatus.Failure);
        }
    }

    useEffect(() => {
        if (!isPostSubmissionModalVisible) {
            setResultStatus(undefined);
        }
    }, [isPostSubmissionModalVisible])

    return (
        <>
            <ModalWrapper
                visibility={isPostSubmissionModalVisible}
                setVisibility={setIsPostSubmissionModalVisible}>
                {
                    resultStatus === ResultStatus.Success &&
                    <div className="flex flex-col w-[80vw] items-center bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-5 pt-6 text-white border-b-[1px] border-orange-400">
                        <span className={"mx-auto mb-3 grid place-items-center min-w-10 min-h-10 rounded-full bg-white/20"}>
                            <Icons.Points />
                        </span>
                        <span className=" bg-green-300/20 p-1 px-2 text-sm text-green-400 rounded-lg">+{TriviaConfig.dailyTriviaPoints.toLocaleString()}</span>
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
                    </div>
                }
                {
                    resultStatus === ResultStatus.Failure &&
                    <div className="flex flex-col w-[80vw] items-center bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-5 pt-6 text-white border-b-[1px] border-orange-400">
                        <span className={"mx-auto mb-3 grid place-items-center min-w-10 min-h-10 rounded-full bg-white/0 text-5xl"}>
                            {/* <Icons.CloseFill className="w-10 h-10" fill="#ed1000" /> */}
                            😢
                        </span>
                        <h3 className="font-semibold text-xl mb-3 text-center">
                            Wrong answer, try again tomorrow.
                        </h3>
                        <span>
                            The correct answer was: <span className="font-semibold">{TriviaConfig.questionsAndAnswers[daysSinceStart].answer}</span>
                        </span>
                        <div className="flex flex-row gap-4 w-full">
                            <button
                                onClick={() => { setIsPostSubmissionModalVisible(false) }}
                                className="w-full p-2 rounded-xl bg-blue-500 focus:bg-blue-600">
                                Ouch, Thank you.
                            </button>
                        </div>
                    </div>
                }
                {
                    resultStatus === ResultStatus.Taken &&
                    <div className="flex flex-col w-[80vw] items-center bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-5 pt-6 text-white border-b-[1px] border-orange-400">
                        <span className={"mx-auto mb-3 grid place-items-center min-w-10 min-h-10 rounded-full bg-white/0 text-5xl"}>
                            {/* <Icons.CloseFill className="w-10 h-10" fill="#ed1000" /> */}
                            😢
                        </span>
                        <h3 className="font-semibold text-xl mb-3 text-center">
                            You have already answered the trivia for today.
                        </h3>
                        <div className="flex flex-row gap-4 w-full">
                            <button
                                onClick={() => { setIsPostSubmissionModalVisible(false) }}
                                className="w-full p-2 rounded-xl bg-blue-500 focus:bg-blue-600">
                                Okay, Thank you.
                            </button>
                        </div>
                    </div>
                }
            </ModalWrapper>

            <main className="flex min-h-screen flex-col items-center py-20">
                <span className="mb-3">
                    <Icons.Trophy2 className="w-20 h-20" />
                </span>
                <div className="mb-8 flex flex-col items-center">
                    <motion.h2
                        initial={{ scale: 3, opacity: 0, filter: "blur(10px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                        transition={{ delay: 0.25, duration: 0.35 }}
                        className="text-white font-medium text-3xl mb-0">
                        Daily Trivia
                    </motion.h2>
                </div>

                {
                    !triviaEnded &&
                        !userHasAnsweredTriviaToday ?
                        <div className="flex flex-col items-center mb-14">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="text-white text-base mb-5">
                                {question}
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
                        </div> :
                        <div className="p-2 py-4 bg-gradient-to-br from-white/0 to-white/10 rounded-2xl">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="text-white text-base mb-0 text-center">
                                {triviaEnded ? "Trivia has ended." : "You have already answered the trivia for today."}
                            </motion.p>
                        </div>
                }
            </main>
        </>
    );
}

export default TriviaPage;