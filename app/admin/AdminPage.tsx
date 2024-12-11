'use client'
import React, { MouseEvent, useEffect, useState } from 'react'
import Button from '../components/ui/button'
import Input from '../components/ui/input'
import Table from '../components/ui/table'
import { BotUser } from '../models/IBotUser'
import { useFetchBotUsers, useRestrictBotUser } from '../api/apiClient'
import { toast } from 'sonner'
import moment from 'moment'
import jsonexport from 'jsonexport'
import BlockConfirmationModal from '../components/modal/BlockConfirmationModal'

export default function AdminPage() {

    const fetchBotUsers = useFetchBotUsers();
    const restrictBotUser = useRestrictBotUser();

    const [passkey, setPassKey] = useState<string>();
    const [isLoginBtnClicked, setIsLoginBtnClicked] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [isFetchingInformation, setIsFetchingInformation] = useState(false);
    const [isDownloadingBotUsers, setIsDownloadingBotUsers] = useState(false);
    const [isRestrictingBotUser, setIsRestrictingBotUser] = useState(false);
    const [selectedBotUser, setSelectedBotUser] = useState<BotUser>();
    const [isBlockConfirmationModalVisible, setIsBlockConfirmationModalVisible] = useState(false);

    const [botUsers, setBotUsers] = useState<BotUser[]>([]);

    const verifyAdmin = async () => {
        if (passkey && passkey == process.env.NEXT_PUBLIC_PASSKEY) {
            setAuthenticated(true);
            await handleFetchBotUsers();
            return;
        }

        toast.error("Invalid passkey");
        setAuthenticated(false);
    };

    const handleFetchBotUsers = async () => {
        console.log("Fetching bot users");

        setIsFetchingInformation(true);

        await fetchBotUsers(passkey as string)
            .then((response) => {
                console.log("🚀 ~ .then ~ response:", response);
                setBotUsers(response.data);
            })
            .catch((error) => {
                toast.error("An error occured while fetching bot users")
                console.log("🚀 ~ handleFetchBotUsers ~ error:", error)
            })
            .finally(() => {
                setIsFetchingInformation(false);
            })
    };

    const handleRestrictBotUser = async () => {
        // show loading spinner
        setIsRestrictingBotUser(true);

        // call the restrict bot user function
        await restrictBotUser(passkey as string, selectedBotUser?.userId as string)
            .then(async (response) => {
                console.log("🚀 ~ .then ~ response:", response);
                toast.success("User restricted successfully");
                setIsBlockConfirmationModalVisible(false);
                await handleFetchBotUsers();
            })
            .catch((error) => {
                toast.error("An error occured while restricting user")
                console.log("🚀 ~ handleRestrictBotUser ~ error:", error)
            })
            .finally(() => {
                // hide loading spinner
                setIsRestrictingBotUser(false);
            })
    };

    async function handleDownloadAllUsersInfo(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsDownloadingBotUsers(true);

        try {
            const formattedData = botUsers.map((user) => ({
                "User ID": user.userId,
                "Username": user.username,
                "Total Points": user.totalPoints,
                "TON Earned": user.tonEarned,
                "NFT Earned": user.nftEarned,
                "TON Spent": user.tonSent,
                "Referral count": user.referralCount,
                "Date Joined": user.createdAt,
                "Connected wallet": user.connectedWallets.length > 0 ? user.connectedWallets[0].walletAddress : 'None',
            }));

            const csvData = await jsonexport(formattedData);
            const fileName = 'users.csv';
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast('Customers information downloaded successfully');
        } catch (error) {
            console.error('Error exporting CSV:', error);
            toast('Failed to download Customer information.');
        } finally {
            setIsDownloadingBotUsers(false);
        }
    };

    useEffect(() => {
        if (passkey && authenticated) {
            handleFetchBotUsers();
        }
    }, [passkey]);

    return (
        <>
            <BlockConfirmationModal
                visibility={isBlockConfirmationModalVisible}
                setVisibility={setIsBlockConfirmationModalVisible}
                handleRestrictBotUser={handleRestrictBotUser}
                selectedBotUser={selectedBotUser}
                isRestrictingBotUser={isRestrictingBotUser}
            />
            {
                !authenticated
                    ? <div className='flex flex-col items-center justify-center h-full gap-8'>
                        <h2 className='text-3xl text-white font-bold text-center'>Welcome Admin</h2>
                        {
                            !isLoginBtnClicked
                                ? <Button onClick={() => setIsLoginBtnClicked(true)} className='w-fit'>Log In</Button>
                                : <div className='flex flex-col gap-2 items-center'>
                                    <Input
                                        className='p-2 rounded-lg'
                                        placeholder='passkey'
                                        type='password'
                                        value={passkey || ''}
                                        onChange={(e) => setPassKey(e.target.value)}
                                    />
                                    <Button onClick={verifyAdmin} className='w-fit'>Submit</Button>
                                </div>
                        }
                    </div>
                    : <div>
                        <div className='flex flex-col gap-4 items-center md:flex-row md:justify-between mb-8'>
                            <h3 className='text-white text-xl font-bold'>Bot Users ({botUsers.length})</h3>
                            <Button
                                disabled={isDownloadingBotUsers}
                                onClick={handleDownloadAllUsersInfo}
                                className='md:w-fit'>
                                Download all
                            </Button>
                        </div>

                        <Table
                            tableHeaders={[
                                <>User ID</>,
                                <>Username</>,
                                <>Points</>,
                                <>TON</>,
                                <>NFT</>,
                                <>TON Sent</>,
                                <>Date joined</>,
                                <>Referrals</>,
                                <>Connected wallet</>,
                                <>Action</>,
                            ]}
                            tableRowsData={
                                botUsers.map((user) => [
                                    <>{user.userId}</>,
                                    <>{user.username}</>,
                                    <>{user.totalPoints}</>,
                                    <>{user.tonEarned}</>,
                                    <>{user.nftEarned}</>,
                                    <>{user.tonSent}</>,
                                    <>{moment(user.createdAt).format("Do MMM, YYYY")}</>,
                                    <>{user.referralCount}</>,
                                    <>{user.connectedWallets.length > 0 ? user.connectedWallets[0].walletAddress : 'None'}</>,
                                    <>
                                        <button
                                            onClick={() => {
                                                setSelectedBotUser(user)
                                                setIsBlockConfirmationModalVisible(true)
                                            }}
                                            className='bg-black text-white p-2 px-4 rounded-full'>
                                            Block
                                        </button>
                                    </>
                                ])
                            }
                            isLoading={isFetchingInformation}
                        />
                    </div>
            }
        </>
    )
}