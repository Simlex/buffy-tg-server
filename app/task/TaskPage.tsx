"use client"
import { FunctionComponent, ReactElement, useContext, useState, useEffect } from "react";
import CustomImage from "../components/ui/image";
import images from "@/public/images";
import { Icons } from "../components/ui/icons";
import ModalWrapper from "../components/modal/ModalWrapper";
import ComponentLoader from "../components/Loader/ComponentLoader";
import { useClaimReferralBonus, useUpdateUserPoints } from "../api/apiClient";
import { PointsUpdateRequest } from "../models/IPoints";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { Task, TaskType } from "../enums/ITask";
import { referralMetrics } from "../constants/referralMetrics";
import { BonusClaimRequest } from "../models/IReferral";
import { SendTransactionRequest, TonConnectUIContext, useTonAddress } from "@tonconnect/ui-react";
import { Address, beginCell, toNano } from "@ton/ton";
import { PointsConfig } from "../constants/globalPointsConfig";

interface TaskStatusProps {
    status: boolean;
}

const TaskStatus: FunctionComponent<TaskStatusProps> = ({ status }) => {
    return (<p className={`text-sm ${status ? "text-green-300/80" : "text-white/60"}`}>{status ? "Done" : "Not done"}</p>);
}

const TaskPage: FunctionComponent = (): ReactElement => {

    const tonConnectUI = useContext(TonConnectUIContext);
    const updateUserPoints = useUpdateUserPoints();
    const claimReferralBonus = useClaimReferralBonus();
    const { userProfileInformation, fetchUserProfileInformation, updateUserProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isClaimModalVisible, setIsClaimModalVisible] = useState(false);
    const [isBonusClaimedModalVisible, setIsBonusClaimedModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(Task.TELEGRAM);
    const [selectedTaskType, setSelectedTaskType] = useState(TaskType.Social);
    const [referralBonusToClaim, setReferralBonusToClaim] = useState<number>();
    const [bonusClaimed, setBonusClaimed] = useState<number>(0);
    const [claimableMetrics, setClaimableMetrics] = useState<number[]>([]);

    const [isJoinChannelBtnClicked, setIsJoinChannelBtnClicked] = useState(false);
    const [isFollowUsBtnClicked, setIsFollowUsBtnClicked] = useState(false);

    const [isVerifyingTask, setIsVerifyingTask] = useState(false);
    const [isClaimingBonus, setIsClaimingBonus] = useState(false);
    // const [depositAmount, setDepositAmount] = useState<number>();
    const [isMakingATransaction, setIsMakingATransaction] = useState(false);

    const telegramPoints = PointsConfig.Telegram;
    const twitterPoints = PointsConfig.Twitter;
    const walletConnectPoints = PointsConfig.walletConnectPoints;
    const tonTransactionPoints = PointsConfig.tonTransactionPoints;

    const userFriendlyAddress = useTonAddress();
    const destination = userFriendlyAddress ? Address.parse(userFriendlyAddress).toRawString() : '';

    async function handleVerifyTask(specifiedTask: Task) {
        // Show loader
        setIsVerifyingTask(true);

        // construct the data 
        const data: PointsUpdateRequest = {
            userId: userProfileInformation?.userId as string,
            points: specifiedTask === Task.TELEGRAM ? telegramPoints : twitterPoints,
            task: specifiedTask
        };

        await updateUserPoints(data)
            .then((response) => {
                console.log("🚀 ~ .then ~ response:", response)
                fetchUserProfileInformation();

                switch (specifiedTask) {
                    case Task.TELEGRAM:
                        setIsJoinChannelBtnClicked(false);
                        break;
                    case Task.TWITTER:
                        setIsFollowUsBtnClicked(false);
                        break;

                    default:
                        break;
                }

                setIsModalVisible(false);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsVerifyingTask(false);
            });
    };

    async function handleClaimReferralBonus() {
        if (isClaimingBonus) return;

        const friendCount = referralMetrics.find(metric => metric.bonus === referralBonusToClaim)?.friends as number;

        // check the claimable metrics if there is any lesser than the bonus to claim
        if (claimableMetrics.find((metric) => metric < friendCount)) {
            setIsClaimModalVisible(true);
            console.log("Claim the lesser bonus first");
            return;
        }

        // Show loader
        setIsClaimingBonus(true);

        // construct the data 
        const data: BonusClaimRequest = {
            userId: userProfileInformation?.userId as string,
            referralCount: friendCount
        };

        await claimReferralBonus(data)
            .then(() => {
                fetchUserProfileInformation();
                setIsBonusClaimedModalVisible(true);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsClaimingBonus(false);
                setReferralBonusToClaim(undefined);
            });
    };

    const body = beginCell()
        .storeUint(0, 32) // Write 32 zero bits to indicate a text comment will follow
        .storeStringTail(`TON transaction from user ${userProfileInformation?.userId}`) // Write the text comment
        .endCell();

    const paymentRequest = (depositAmount: number): SendTransactionRequest => {
        return {
            messages: [
                {
                    address: destination,
                    amount: toNano(depositAmount || 0).toString(),
                    payload: body.toBoc().toString('base64'), // Optional: Additional data
                },
            ],

            validUntil: Math.floor(Date.now() / 1000) + 360, // Expiration time in seconds since epoch = now + 360 seconds
        };
    };

    const handleAwardPoints = (task: Task) => {
        console.log("🚀 ~ task:", task)
    };

    const handleMakeATransaction = (depositAmount: number) => {
        if (!depositAmount) {
            console.log("🚀 ~ handleBuyRolls ~ depositAmount:", depositAmount)
            return;
        };

        if (!tonConnectUI?.connected) {
            open();
            // setIsModalVisible(true);
            return;
        }

        setIsMakingATransaction(true);

        // send request to api to award points for connecting wallet, and then update the user profile information

        if (tonConnectUI) {
            tonConnectUI
                .sendTransaction(paymentRequest(depositAmount))
                .then(async (transactionResult) => {
                    console.log('Transaction successful:', transactionResult);

                    const data: PointsUpdateRequest = {
                        userId: userProfileInformation?.userId as string,
                        points: tonTransactionPoints,
                        task: Task.TON_TRANSACTION,
                    }

                    await updateUserPoints(data)
                        .then((response) => {
                            console.log("🚀 ~ .then ~ response:", response)
                            updateUserProfileInformation(response.data);

                            setIsModalVisible(false);
                        })
                        .catch((error) => {
                            console.error('Transaction failed:', error);
                        })
                        .finally(() => { })
                })
                .catch((error) => {
                    console.error('Transaction failed:', error);
                })
                .finally(() => {
                    setIsMakingATransaction(false);
                });
        } else {
            console.log('Wallet is not connected');
            alert(`Wallet is not connected `);
            setIsMakingATransaction(false);
        }
    };

    const taskInfo = [
        {
            icon: (className?: string) => <Icons.Telegram className={className} />,
            task: Task.TELEGRAM,
            title: "Join our telegram channel",
            points: telegramPoints,
            action: "Join",
            isDone: isJoinChannelBtnClicked,
            actionFunction: () => {
                setIsJoinChannelBtnClicked(true)
                window.open("https://t.me/BuffyDurov", "_blank");
            },
            verificationFunction: () => handleVerifyTask(Task.TELEGRAM)
        },
        {
            icon: (className?: string) => <Icons.Twitter className={className} />,
            task: Task.TWITTER,
            title: "Follow us on twitter",
            points: twitterPoints,
            action: "Follow",
            isDone: isFollowUsBtnClicked,
            actionFunction: () => {
                setIsFollowUsBtnClicked(true)
                window.open("https://x.com/buffydurov?s=11", "_blank");
            },
            verificationFunction: () => handleVerifyTask(Task.TWITTER)
        },
        {
            icon: (className?: string) => <Icons.Wallet className={className} />,
            task: Task.WALLET_CONNECT,
            title: "Connect Wallet",
            points: walletConnectPoints,
            action: tonConnectUI?.connected ? "Claim Bonus!" : "Connect",
            hideRhsBtn: tonConnectUI?.connected,
            isDone: userProfileInformation?.isWalletConnected ?? false,
            actionFunction: async () => tonConnectUI?.connected ? await handleVerifyTask(Task.WALLET_CONNECT) : open(),
            verificationFunction: () => handleVerifyTask(Task.WALLET_CONNECT),
            isLoading: isVerifyingTask
        },
        {
            icon: (className?: string) => <Icons.Ton fill="#fff" className={`w-8 h-8 ${className}`} />,
            task: Task.TON_TRANSACTION,
            title: "Make a 0.3 TON transaction",
            points: tonTransactionPoints,
            action: "Transact",
            isDone: userProfileInformation?.hadMadeFirstTonTransaction ?? false,
            actionFunction: () => {
                handleMakeATransaction(0.3);
            },
            verificationFunction: () => handleAwardPoints(Task.TON_TRANSACTION)
        }
    ];

    const selectedTaskInfo = taskInfo.find(task => task.task === selectedTask);

    useEffect(() => {
        if (isBonusClaimedModalVisible) {
            setTimeout(() => {
                setIsBonusClaimedModalVisible(false);
            }, 3000);
        };
    }, [isBonusClaimedModalVisible]);

    useEffect(() => {
        if (referralBonusToClaim && !isClaimingBonus) {
            handleClaimReferralBonus();
        };
    }, [referralBonusToClaim]);

    useEffect(() => {
        if (userProfileInformation && userProfileInformation.highestReferralBonusClaimed) {
            setBonusClaimed(userProfileInformation.highestReferralBonusClaimed);
            setClaimableMetrics(referralMetrics.filter(metric => ((metric.friends > (userProfileInformation.highestReferralBonusClaimed as number)) && ((userProfileInformation.referralCount as number) > metric.friends))).map(metric => metric.friends));
        }
    }, [userProfileInformation]);

    return (
        <>
            <ModalWrapper
                visibility={isModalVisible}
                setVisibility={setIsModalVisible}>
                <div className="flex flex-col w-[80vw] items-center bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-5 pt-6 text-white border-b-[1px] border-orange-400">
                    <span className={"mx-auto mb-3"}>
                        {selectedTaskInfo?.icon(selectedTaskInfo?.task === Task.TWITTER ? "fill-white" : "")}
                    </span>
                    <h3 className="font-semibold text-xl mb-3 text-center">{selectedTaskInfo?.title}</h3>
                    <div className="flex items-center gap-1 mb-4">
                        <span className="relative w-6 h-6">
                            <CustomImage src={images.coin} alt="Coin" />
                        </span>
                        <h5 className="text-xl font-bold">+{selectedTaskInfo?.points.toLocaleString()}</h5>
                    </div>
                    <div className="flex flex-row gap-4 w-full">
                        <button
                            disabled={isVerifyingTask}
                            onClick={() => selectedTaskInfo?.actionFunction()}
                            className="relative w-full p-2 rounded-xl bg-blue-500 focus:bg-blue-600">
                            {
                                isMakingATransaction ?
                                    <ComponentLoader className="absolute inset-0 m-auto w-5 h-5" /> :
                                    selectedTaskInfo?.action
                            }
                        </button>
                        {!selectedTaskInfo?.hideRhsBtn &&
                            <button
                                disabled={isVerifyingTask}
                                onClick={() => { selectedTaskInfo?.verificationFunction() }}
                                className={`relative w-full p-2 rounded-xl bg-blue-500 focus:bg-blue-600 ${selectedTaskInfo?.isDone ? "" : " bg-gray-500 pointer-events-none"}`}>
                                {
                                    isVerifyingTask ?
                                        <ComponentLoader className="absolute inset-0 m-auto w-5 h-5" /> :
                                        "Check"
                                }
                            </button>
                        }
                    </div>
                </div>
            </ModalWrapper>

            <ModalWrapper
                visibility={isClaimModalVisible}
                setVisibility={setIsClaimModalVisible}>
                <div className="flex flex-col w-[80vw] items-center bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-5 pt-6 text-white border-b-[1px] border-orange-400">
                    <span className={"mx-auto mb-3 grid place-items-center min-w-10 min-h-10 rounded-full bg-white/20"}>
                        <Icons.Points />
                    </span>
                    <h3 className="font-semibold text-xl mb-3 text-center">You need to claim lesser points first.</h3>
                    {/* <div className="flex items-center gap-1 mb-4">
                        <span className="relative w-6 h-6">
                            <CustomImage src={images.coin} alt="Coin" />
                        </span>
                        <h5 className="text-xl font-bold">+{selectedTaskInfo?.points.toLocaleString()}</h5>
                    </div> */}
                    <div className="flex flex-row gap-4 w-full">
                        <button
                            onClick={() => { setIsClaimModalVisible(false) }}
                            className="w-full p-2 rounded-xl bg-blue-500 focus:bg-blue-600">
                            Okay, Got it.
                        </button>
                    </div>
                </div>
            </ModalWrapper>

            <ModalWrapper
                visibility={isBonusClaimedModalVisible}
                setVisibility={setIsBonusClaimedModalVisible}>
                <div className="flex flex-col w-[80vw] items-center bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-5 pt-6 text-white border-b-[1px] border-orange-400">
                    <span className={"mx-auto mb-3 grid place-items-center min-w-10 min-h-10 rounded-full bg-white/20"}>
                        <Icons.Points />
                    </span>
                    <h3 className="font-semibold text-xl mb-3 text-center">
                        Bonus claimed successfully.
                    </h3>
                    <div className="flex flex-row gap-4 w-full">
                        <button
                            onClick={() => { setIsClaimModalVisible(false) }}
                            className="w-full p-2 rounded-xl bg-blue-500 focus:bg-blue-600">
                            Okay, Thank you.
                        </button>
                    </div>
                </div>
            </ModalWrapper>

            <main className="flex min-h-screen flex-col items-center py-14">
                <h2 className="text-white font-medium text-3xl mb-10">Tasks</h2>

                {
                    userProfileInformation &&
                    <div className="w-full flex flex-col gap-3 mb-10">
                        <div className="w-full flex gap-2">
                            <button
                                onClick={() => setSelectedTaskType(TaskType.Social)}
                                className={`py-2 p-5 rounded-full font-bold text-sm ${selectedTaskType === TaskType.Social ? "bg-white text-gray-700" : "bg-white/20 text-white"}`}>
                                In-Game
                            </button>
                            <button
                                onClick={() => setSelectedTaskType(TaskType.Referral)}
                                className={`py-2 p-5 rounded-full font-bold text-sm ${selectedTaskType === TaskType.Referral ? "bg-white text-gray-700" : "bg-white/20 text-white"}`}>
                                Referral
                            </button>
                            {/* <button
                                onClick={() => setSelectedTaskType(TaskType.Others)}
                                className={`py-2 p-5 rounded-full font-bold text-sm ${selectedTaskType === TaskType.Others ? "bg-white text-gray-700" : "bg-white/20 text-white"}`}>
                                Others
                            </button> */}
                        </div>

                        {
                            selectedTaskType === TaskType.Social &&
                            <>
                                <button
                                    onClick={() => {
                                        setSelectedTask(Task.WALLET_CONNECT);
                                        setIsModalVisible(true);
                                    }}
                                    className={`bg-gray-700 rounded-3xl flex flex-row items-center justify-between p-4 pr-5 hover:bg-gray-600 ${userProfileInformation.isWalletConnected ? "pointer-events-none opacity-70" : ""}`}>
                                    <div className="flex flex-row items-center gap-3">
                                        <span className="w-7 h-7 relative grid place-items-center">
                                            <Icons.Wallet />
                                        </span>
                                        <div className="flex flex-col gap-[2px] items-start">
                                            <h5 className="text-white font-medium leading-3 text-base">Connect Wallet</h5>
                                            <TaskStatus status={userProfileInformation.isWalletConnected} />
                                        </div>
                                    </div>
                                    <span className="w-7 h-7 rounded-full bg-white/30 grid place-items-center">
                                        {
                                            userProfileInformation.isWalletConnected ?
                                                <Icons.CheckFill className="fill-white" /> :
                                                <Icons.CloseFill className="fill-white" />
                                        }
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedTask(Task.TON_TRANSACTION);
                                        setIsModalVisible(true);
                                    }}
                                    className={`bg-gray-700 rounded-3xl flex flex-row items-center justify-between p-4 pr-5 hover:bg-gray-600 ${userProfileInformation.hadMadeFirstTonTransaction ? "pointer-events-none opacity-70" : ""}`}>
                                    <div className="flex flex-row items-center gap-3">
                                        <span className="w-7 h-7 relative grid place-items-center">
                                            <Icons.Wallet />
                                        </span>
                                        <div className="flex flex-col gap-[2px] items-start">
                                            <h5 className="text-white font-medium leading-3 text-base">Make a TON transaction</h5>
                                            <TaskStatus status={userProfileInformation.hadMadeFirstTonTransaction} />
                                        </div>
                                    </div>
                                    <span className="w-7 h-7 rounded-full bg-white/30 grid place-items-center">
                                        {
                                            userProfileInformation.hadMadeFirstTonTransaction ?
                                                <Icons.CheckFill className="fill-white" /> :
                                                <Icons.CloseFill className="fill-white" />
                                        }
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedTask(Task.TELEGRAM);
                                        setIsModalVisible(true);
                                    }}
                                    className={`bg-gray-700 rounded-3xl flex flex-row items-center justify-between p-4 pr-5 hover:bg-gray-600 ${userProfileInformation.telegramTaskDone ? "pointer-events-none opacity-70" : ""}`}>
                                    <div className="flex flex-row items-center gap-3">
                                        <span className="w-7 h-7 relative grid place-items-center">
                                            <Icons.Telegram />
                                        </span>
                                        <div className="flex flex-col gap-[2px] items-start">
                                            <h5 className="text-white font-medium leading-3 text-base">Join telegram channel</h5>
                                            <TaskStatus status={userProfileInformation.telegramTaskDone} />
                                        </div>
                                    </div>
                                    <span className="w-7 h-7 rounded-full bg-white/30 grid place-items-center">
                                        {
                                            userProfileInformation.telegramTaskDone ?
                                                <Icons.CheckFill className="fill-white" /> :
                                                <Icons.CloseFill className="fill-white" />
                                        }
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedTask(Task.TWITTER);
                                        setIsModalVisible(true);
                                    }}
                                    className={`bg-gray-700 rounded-3xl flex flex-row items-center justify-between p-4 pr-5 hover:bg-gray-600 ${userProfileInformation.twitterTaskDone ? "pointer-events-none opacity-70" : ""}`}>
                                    <div className="flex flex-row items-center gap-3">
                                        <span className="w-7 h-7 relative grid place-items-center">
                                            <Icons.Twitter className="fill-white" />
                                        </span>
                                        <div className="flex flex-col gap-[2px] items-start">
                                            <h5 className="text-white font-medium leading-3 text-base">Follow us on X</h5>
                                            <TaskStatus status={userProfileInformation.twitterTaskDone} />
                                        </div>
                                    </div>
                                    <span className="w-7 h-7 rounded-full bg-white/30 grid place-items-center">
                                        {
                                            userProfileInformation.twitterTaskDone ?
                                                <Icons.CheckFill className="fill-white" /> :
                                                <Icons.CloseFill className="fill-white" />
                                        }
                                    </span>
                                </button>
                            </>
                        }
                        {
                            selectedTaskType === TaskType.Referral && userProfileInformation &&
                            <div className="flex flex-col gap-3">
                                {
                                    referralMetrics.map((metric, index) => {
                                        // const bonusClaimed = userProfileInformation.highestReferralBonusClaimed;
                                        const isBonusClaimed = bonusClaimed >= metric.friends;

                                        const userIsNotEligible = userProfileInformation.referralCount as number < metric.friends;

                                        const isSelectedMetricBeingClaimed = isClaimingBonus && referralBonusToClaim == metric.bonus;

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => { }}
                                                className={`bg-gray-700 rounded-3xl flex flex-row items-center justify-between p-4 pr-5 ${userIsNotEligible || isBonusClaimed ? "pointer-events-none opacity-60" : ""}`}>
                                                <div className="flex flex-row items-center gap-3">
                                                    <span className="w-7 h-7 relative grid place-items-center">
                                                        <Icons.Points fill="#fff" />
                                                    </span>
                                                    <div className="flex flex-col gap-[2px] items-start">
                                                        <h5 className="text-white font-medium leading-3 text-base">Refer {metric.friends} friends</h5>
                                                        <div className="flex flex-row gap-2 items-baseline">
                                                            <p className={`text-sm text-white/60`}>{metric.bonus.toLocaleString()} points</p>
                                                            {
                                                                metric.tonBonus ?
                                                                    <p className={`text-sm text-white/60`}>+ {metric.tonBonus} TON</p> : <></>
                                                            }
                                                            {/* <TaskStatus status={userProfileInformation.referralTaskDone} /> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    className={`bg-white text-gray-700 p-1 px-2 rounded-lg opacity-100 ${isClaimingBonus ? "pointer-events-none" : ""}`}
                                                    onClick={() => setReferralBonusToClaim(metric.bonus)}>
                                                    {isSelectedMetricBeingClaimed ? "Claiming..." : "Claim"}
                                                </button>
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                }
            </main>
        </>
    );
}

export default TaskPage;