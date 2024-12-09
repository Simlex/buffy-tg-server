import React from 'react'
import ModalWrapper from './ModalWrapper'
import { Icons } from '../ui/icons'
import { BotUser } from '@/app/models/IBotUser'
import Button from '../ui/button'

interface Props {
    visibility: boolean
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>
    handleRestrictBotUser: () => Promise<void>
    selectedBotUser: BotUser | undefined
    isRestrictingBotUser: boolean
}

export default function BlockConfirmationModal(
    { visibility, setVisibility, handleRestrictBotUser,
        selectedBotUser, isRestrictingBotUser }: Props) {
    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            <div className='bg-white p-5 rounded-3xl flex flex-col'>
                <div className='flex flex-row justify-center items-center mb-2'>
                    <h3 className='text-2xl'>Are you sure about this?</h3>
                    <span onClick={() => setVisibility(false)} className='ml-auto w-10 h-10 grid place-items-center rounded-full bg-red-500/5 cursor-pointer'>
                        <Icons.CloseIcon fill='#ed1000' />
                    </span>
                </div>
                <p className='mb-5 text-black/50'>You are about to block user {selectedBotUser?.userId}</p>
                <div className='flex flex-row items-center'>
                    <Button
                        onClick={() => setVisibility(false)}
                        className='bg-white text-black p-2 px-4 rounded-full ml-2 w-1/2'>
                        Cancel
                    </Button>
                    <Button
                        disabled={isRestrictingBotUser}
                        isLoading={isRestrictingBotUser}
                        onClick={handleRestrictBotUser}
                        className='bg-black text-white !p-2 !px-4 rounded-full w-1/2'>
                        Block
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    )
}