import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Whisper Net',
    description: 'A safe space for sharing thoughts anonymously. Connect, share, and receive genuine feedback without barriers.',
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" >
            <AuthProvider>
                <body className={inter.className}>
                    {children}
                    <Toaster />
                </body>
            </AuthProvider>
        </html>
    );
}
