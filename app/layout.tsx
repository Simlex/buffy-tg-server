import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.scss';
import GlobalProvider from './Provider';
import { WrappedLayout } from './components/Layout';
// import { startScheduler } from './scripts/scheduler';

const dmSans = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Buffy ',
    description: 'Telegram clicker bot'
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    //TODO Check if user is connected to internet

    // await startScheduler(); // Start the scheduler

    return (
        <html lang="en" data-theme={"light"} className='bg-white'>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1, user-scalable=no" />
            <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
            <link rel="manifest" href="/tonconnect-manifest.json" />

            <GlobalProvider>
                <body className={`${dmSans.className} p-6 relative bg-gradient-to-b from-slate-800 to-black to-slate-0`}>
                    <div className='w-full h-full absolute top-0 left-0 pointer-events-none opacity-10 bg-[url(/images/bg-image.jpg)] bg-center bg-cover bg-fixed bg-no-repeat'></div>
                    <WrappedLayout>
                        {children}
                    </WrappedLayout>
                </body>
            </GlobalProvider>
        </html>
    )
}
