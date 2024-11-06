"use client"
import React from 'react';
import { AppProvider } from './context/ApplicationContext';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

type Props = {
    children?: React.ReactNode
}

const GlobalProvider = ({ children }: Props) => {
    return (
        <TonConnectUIProvider 
        // manifestUrl="https://2c10-41-184-8-14.ngrok-free.app/tonconnect-manifest.json">
        manifestUrl="https://gist.githubusercontent.com/alexcraviotto/b5d974bc120c3b46a0d047ba79cb4874/raw/2b04202d388d9547173b56c6ef27734edba18b29/tonconnect-manifest.json">
            <AppProvider>
                {children}
            </AppProvider>
        </TonConnectUIProvider>
    );
};

export default GlobalProvider;