import React from 'react'
import ModalWrapper from './ModalWrapper'
import { TonConnectButton } from '@tonconnect/ui-react'
import { Icons } from '../ui/icons'

type Props = {
    visibility: boolean
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ConnectWalletModal({ visibility, setVisibility }: Props) {
    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            <div className='bg-white p-5 rounded-3xl flex flex-col'>
                <div className='flex flex-row justify-center items-center mb-2'>
                    <h3 className='text-2xl'>Connect wallet</h3>
                    <span onClick={() => setVisibility(false)} className='ml-auto w-10 h-10 grid place-items-center rounded-full bg-red-500/5 cursor-pointer'>
                        <Icons.CloseIcon fill='#ed1000' />
                    </span>
                </div>
                <p className='mb-5 text-black/50'>You need to connect your wallet to proceed.</p>
                <TonConnectButton style={{ marginLeft: "auto" }} />
            </div>
        </ModalWrapper>
    )
}