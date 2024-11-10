import React from 'react'
import ModalWrapper from './ModalWrapper'
import { Icons } from '../ui/icons'

interface Props {
    visibility: boolean
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DiceGameInfoModal({ visibility, setVisibility }: Props) {
    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            <div className='bg-white p-5 rounded-3xl flex flex-col'>
                <div className='flex flex-row justify-center items-center mb-2'>
                    <h3 className='text-2xl'>Dice roll rewards</h3>
                    <span onClick={() => setVisibility(false)} className='ml-auto w-10 h-10 grid place-items-center rounded-full bg-red-500/5 cursor-pointer'>
                        <Icons.CloseIcon fill='#ed1000' />
                    </span>
                </div>
                <p className='mb-5 text-black/50'>Roll the dice and win exciting rewards based on the face you land on! Here’s what you can earn:</p>
                <div>
                    <p>1️⃣: Win 2,000 points to boost your score!</p>
                    <p>2️⃣: Score 15,000 points and climb up the leaderboard.</p>
                    <p>3️⃣: Earn a whopping 50,000 points and take the lead!</p>
                    <p>4️⃣: Receive 2 TON tokens as a crypto reward.</p>
                    <p>5️⃣: Pocket 7.5 TON tokens for a bigger win!</p>
                    <p>6️⃣: Get 1 exclusive NFT added to your collection!</p>
                </div>
                {/* <div className='rounded-xl overflow-hidden border-2 border-black/5'>
                    <table className='w-full'>
                        <thead className='bg-gray-500/10 text-left'>
                            <tr>
                                <th className='p-2'>Roll</th>
                                <th className='p-2'>Points</th>
                                <th className='p-2'>Ton</th>
                                <th className='p-2'>Nft</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pointsMappings.map((point, index) => (
                                    <tr key={index}>
                                        <td className='p-2 py-1'>{point.diceRoll}</td>
                                        <td className='p-2 py-1'>{point.points ?? 0}</td>
                                        <td className='p-2 py-1'>{point.ton ?? 0}</td>
                                        <td className='p-2 py-1'>{point.nft ?? 0}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div> */}
            </div>
        </ModalWrapper>
    )
}