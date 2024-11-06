"use client"
import React, { useContext } from 'react'
import { Icons } from '../components/ui/icons'
import { RollsPurchasesConfig } from '../constants/purchases'
import ConnectWalletModal from '../components/modal/ConnectWalletModal'
import { SendTransactionRequest, TonConnectUIContext, useTonAddress, useTonConnectModal, useTonWallet } from '@tonconnect/ui-react'
import { Address, beginCell, toNano } from '@ton/ton';
import { motion } from 'framer-motion'

export default function WalletPage() {
    const tonConnectUI = useContext(TonConnectUIContext);

    const userFriendlyAddress = useTonAddress();
    // const rawAddress = useTonAddress(false);
    // const wallet = useTonWallet();
    // const { state, open, close } = useTonConnectModal(); // for opening and closing the modal
    const { open } = useTonConnectModal(); // for opening and closing the modal

    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const destination = userFriendlyAddress ? Address.parse(userFriendlyAddress).toRawString() : '';
    const depositAmount = 0.5; // 0.5 TON

    const body = beginCell()
        .storeUint(0, 32) // Write 32 zero bits to indicate a text comment will follow
        .storeStringTail("Some random comment here") // Write the text comment
        .endCell();

    const paymentRequest: SendTransactionRequest = {
        messages: [
            {
                address: destination,
                amount: toNano(depositAmount).toString(),
                payload: body.toBoc().toString('base64'), // Optional: Additional data
            },
        ],

        validUntil: Math.floor(Date.now() / 1000) + 360, // Expiration time in seconds since epoch = now + 360 seconds
    };

    const handleBuyRolls = () => {
        if (!tonConnectUI?.connected) {
            open();
            // setIsModalVisible(true);
            return;
        }

        if (tonConnectUI) {
            tonConnectUI
                .sendTransaction(paymentRequest)
                .then((transactionResult) => {
                    console.log('Transaction successful:', transactionResult);
                })
                .catch((error) => {
                    console.error('Transaction failed:', error);
                });
        } else {
            console.log('Wallet is not connected');
            alert(`Wallet is not connected `);
        }
    }

    return (
        <>
            <ConnectWalletModal
                visibility={isModalVisible}
                setVisibility={setIsModalVisible}
            />
            <main className="flex min-h-screen flex-col items-center py-14 pb-32">
                <span className='w-24 h-24 rounded-full bg-white/10 grid place-items-center border-8 border-orange-500/5 mb-3'>
                    <Icons.Cart className='w-12 h-12' fill='#fff' />
                </span>
                <div className='mb-14 text-center'>
                    <h2 className="text-white font-medium text-3xl">Rolls Purchase</h2>
                    <p className='text-white/70'>You can purchase rolls for dice roll game here</p>
                </div>

                {/* <div>
                    <TonConnectButton style={{ marginLeft: "auto" }} />
                </div> */}

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

                <div className='flex flex-col w-full'>
                    {
                        RollsPurchasesConfig.map((purchase, index) => (
                            <div key={index} className='bg-white/20 p-4 rounded-3xl flex items-center justify-between mb-4'>
                                <div>
                                    <h3 className='text-white font-bold'>{purchase.roll} rolls</h3>
                                    <p className='text-white/60'>{purchase.tonPrice} TON</p>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleBuyRolls()} className='bg-orange-500 text-white font-bold py-2 px-4 rounded-2xl'>
                                    Buy
                                </motion.button>
                            </div>
                        ))
                    }
                </div>
            </main>
        </>
    )
}