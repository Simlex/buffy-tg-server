"use client"
import React, { useContext, useEffect } from 'react'
import { RollsPurchasesConfig } from '../constants/purchases'
import ConnectWalletModal from '../components/modal/ConnectWalletModal'
import { SendTransactionRequest, TonConnectUIContext, useTonConnectModal } from '@tonconnect/ui-react'
import { Address, beginCell, toNano } from '@ton/ton';
import { motion } from 'framer-motion'
import { useUpdateUserRollsPoints } from '../api/apiClient'
import { ApplicationContext, ApplicationContextData } from '../context/ApplicationContext'
import { PointsUpdateRequest } from '../models/IPoints'
import { ButtonLoader } from '../components/Loader/ComponentLoader'

export default function WalletPage() {
    const updateUserRollsPoints = useUpdateUserRollsPoints();
    const { userProfileInformation, updateUserProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;
    const tonConnectUI = useContext(TonConnectUIContext);

    const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS!;

    // const userFriendlyAddress = useTonAddress();
    // const rawAddress = useTonAddress(false);
    // const wallet = useTonWallet();
    // const { state, open, close } = useTonConnectModal(); // for opening and closing the modal
    const { open } = useTonConnectModal(); // for opening and closing the modal

    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const destination = Address.parse(walletAddress).toRawString();
    const [depositAmount, setDepositAmount] = React.useState<number>();
    const [isDepositing, setIsDepositing] = React.useState(false);

    const premiumSubscriptionTonFee = 2.5;

    const body = beginCell()
        .storeUint(0, 32) // Write 32 zero bits to indicate a text comment will follow
        .storeStringTail("Some random comment here") // Write the text comment
        .endCell();

    const paymentRequest: SendTransactionRequest = {
        messages: [
            {
                address: destination,
                amount: toNano(depositAmount || 0).toString(),
                payload: body.toBoc().toString('base64'), // Optional: Additional data
            },
        ],

        validUntil: Math.floor(Date.now() / 1000) + 360, // Expiration time in seconds since epoch = now + 360 seconds
    };

    const handleBuyRolls = () => {
        if (!depositAmount) {
            console.log("🚀 ~ handleBuyRolls ~ depositAmount:", depositAmount)
            return;
        };

        if (!tonConnectUI?.connected) {
            open();
            // setIsModalVisible(true);
            return;
        }

        setIsDepositing(true);

        // send request to api to award points for connecting wallet, and then update the user profile information

        if (tonConnectUI) {
            tonConnectUI
                .sendTransaction(paymentRequest)
                .then(async (transactionResult) => {
                    console.log('Transaction successful:', transactionResult);

                    const data: PointsUpdateRequest = {
                        userId: userProfileInformation?.userId as string,
                        ton: depositAmount,
                        points: RollsPurchasesConfig.find(purchase => purchase.tonPrice === depositAmount)?.roll || 0,
                        forPremiumSubscription: depositAmount === premiumSubscriptionTonFee
                    }

                    await updateUserRollsPoints(data)
                        .then((response) => {
                            updateUserProfileInformation(response.data);
                        })
                        .catch((error) => {
                            console.log('Transaction failed:', error);
                        })
                        .finally(() => { })
                })
                .catch((error) => {
                    console.error('Transaction failed:', error);
                })
                .finally(() => {
                    setIsDepositing(false);
                    setDepositAmount(undefined);
                });
        } else {
            console.log('Wallet is not connected');
            alert(`Wallet is not connected `);
            setIsDepositing(false);
        }
    };

    useEffect(() => {
        handleBuyRolls();
    }, [depositAmount]);

    useEffect(() => {
        if (!tonConnectUI) return;
        if (!tonConnectUI.connected) {
            open();
            // setIsModalVisible(true);
            return;
        }
    }, [tonConnectUI]);

    return (
        <>
            <ConnectWalletModal
                visibility={isModalVisible}
                setVisibility={setIsModalVisible}
            />
            <main className="flex min-h-screen flex-col items-center py-14 pb-32">
                <span className='w-28 h-28 rounded-full bg-white/0 grid place-items-center border-[10px] border-[#24A1DE]/5 mb-3'>
                    {/* <Icons.Cart className='w-12 h-12' fill='#fff' /> */}
                    <motion.span
                        animate={{
                            scale: [1, 0.9, 1],
                            // transformStyle: "preserve-3d",
                            // transform: ["translateY(0px)", "translateY(-10px)", "translateY(0px)"], 
                            transitionBehavior: "ease-in-out",
                            transition: {
                                duration: 2.5,
                                repeat: Infinity
                            }
                        }}
                        className='text-[64px]'>
                        💎
                    </motion.span>
                </span>
                <div className='mb-10 text-center'>
                    <h2 className="text-white font-medium text-3xl">Rolls Purchase</h2>
                    <p className='text-white/70'>You can purchase rolls for dice roll game here</p>
                </div>

                {/* <TonConnectButton style={{ marginLeft: "auto" }} /> */}

                {/* <div className='bg-white/20 p-3 rounded-3xl flex items-center justify-between mb-14'>
                    <div>
                        <h3 className='text-white font-bold'>Your Address</h3>
                        <p className='text-white/60'>{userFriendlyAddress}</p>
                        <p className='text-white/60'>{rawAddress}</p>
                    </div>
                    <button className='bg-orange-500 text-white font-bold py-2 px-4 rounded-2xl'>
                        Copy
                    </button>
                </div> */}

                <div className='flex flex-col w-full mb-4'>
                    <span className='text-white mb-2'>Premium</span>
                    <div className=' bg-gradient-to-br from-[#24A1DE] to-[#086b9c] p-4 rounded-3xl flex items-center justify-between mb-4'>
                        <div>
                            <h3 className='text-white font-bold'>4 daily rolls + other perks</h3>
                            <p className='text-white/60'>{premiumSubscriptionTonFee} TON</p>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                setDepositAmount(premiumSubscriptionTonFee);
                            }}
                            disabled={isDepositing}
                            className='bg-orange-500 text-white font-bold py-2 px-4 rounded-2xl relative overflow-hidden disabled:pointer-events-none'>
                            Buy
                            {isDepositing && depositAmount == premiumSubscriptionTonFee && <ButtonLoader />}
                        </motion.button>
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    <span className='text-white mb-2'>Others</span>
                    {
                        RollsPurchasesConfig.map((purchase, index) => (
                            <div key={index} className='bg-white/20 p-4 rounded-3xl flex items-center justify-between mb-4'>
                                <div>
                                    <h3 className='text-white font-bold'>{purchase.roll} rolls</h3>
                                    <p className='text-white/60'>{purchase.tonPrice} TON</p>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        setDepositAmount(purchase.tonPrice);
                                    }}
                                    disabled={isDepositing}
                                    className='bg-orange-500 text-white font-bold py-2 px-4 rounded-2xl relative overflow-hidden disabled:pointer-events-none'>
                                    Buy
                                    {isDepositing && depositAmount == purchase.tonPrice && <ButtonLoader />}
                                </motion.button>
                            </div>
                        ))
                    }
                </div>
            </main>
        </>
    )
}