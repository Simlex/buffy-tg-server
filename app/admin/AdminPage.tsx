'use client'
import React, { useEffect, useState } from 'react'
import Button from '../components/ui/button'
import Input from '../components/ui/input'
import Table from '../components/ui/table'
import { BotUser } from '../models/IBotUser'
import { useFetchBotUsers } from '../api/apiClient'
import { toast } from 'sonner'
import moment from 'moment'

export default function AdminPage() {

    const fetchBotUsers = useFetchBotUsers();

    const [passkey, setPassKey] = useState<string>();
    const [isLoginBtnClicked, setIsLoginBtnClicked] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [isFetchingInformation, setIsFetchingInformation] = useState(false);

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

    useEffect(() => {
        if (passkey && authenticated) {
            handleFetchBotUsers();
        }
    }, [passkey])

    return (
        <>
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
                            <h3 className='text-white text-xl font-bold'>Bot Users</h3>
                            <Button className='md:w-fit'>Download all</Button>
                        </div>

                        <Table
                            tableHeaders={[
                                <>Name</>,
                                <>Points</>,
                                <>TON</>,
                                <>NFT</>,
                                <>Date joined</>,
                                <>Referrals</>,
                            ]}
                            tableRowsData={
                                botUsers.map((user) => [
                                    <>{user.userId}</>, <>{user.totalPoints}</>, <>{user.tonEarned}</>, <>{user.nftEarned}</>, <>{moment(user.createdAt).format("Do MMM, YYYY")}</>, <>{user.referralCount}</>
                                ])
                            }
                            isLoading={isFetchingInformation}
                        />
                    </div>
            }
        </>
    )
}